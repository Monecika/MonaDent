import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PatientLiveUpdatesService {
  private readonly changes = new Subject<void>();
  readonly changes$: Observable<void> = this.changes.asObservable();

  private active = false;
  private controller: AbortController | null = null;

  connect(): void {
    if (this.active) return;
    this.active = true;
    void this.listen();
  }

  disconnect(): void {
    this.active = false;
    this.controller?.abort();
    this.controller = null;
  }

  private async listen(): Promise<void> {
    let reconnectDelay = 1000;
    while (this.active) {
      const token = localStorage.getItem('userAccessToken');
      if (!token) {
        await this.pause(1500);
        continue;
      }

      const controller = new AbortController();
      this.controller = controller;
      let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
      let connected = false;
      try {
        const response = await fetch('/api/events/patients', {
          headers: {
            Accept: 'text/event-stream',
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
          signal: controller.signal,
        });
        if (!response.ok || !response.body) {
          throw new Error(`Patient update stream returned HTTP ${response.status}.`);
        }

        reader = response.body.getReader();
        connected = true;
        reconnectDelay = 1000;
        const decoder = new TextDecoder();
        let buffer = '';
        while (this.active) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const events = buffer.split(/\r?\n\r?\n/);
          buffer = events.pop() ?? '';
          for (const event of events) {
            const eventName = event
              .split(/\r?\n/)
              .find((line) => line.startsWith('event:'))
              ?.slice('event:'.length)
              .trim();
            if (eventName === 'patient-changed') {
              this.changes.next();
            }
          }
        }
      } catch {
        // Reconnect after temporary network failures; aborts happen when the authenticated layout closes.
      } finally {
        reader?.releaseLock();
        if (this.controller === controller) this.controller = null;
      }

      if (this.active) {
        await this.pause(reconnectDelay);
        if (!connected) reconnectDelay = Math.min(reconnectDelay * 2, 15000);
      }
    }
  }

  private pause(milliseconds: number): Promise<void> {
    return new Promise((resolve) => globalThis.setTimeout(resolve, milliseconds));
  }
}
