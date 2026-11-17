import { Component, DestroyRef, HostListener, Input, OnChanges, OnDestroy, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideDownload,
  LucideFileImage,
  LucideUpload,
  LucideX,
} from '@lucide/angular';
import { EMPTY, Subscription, auditTime, from, concatMap, catchError, finalize, map, mergeMap, tap } from 'rxjs';
import { Container } from '../../../../components/container/container';
import { TranslatePipe } from '../../../../core/pipes/translate-pipe';
import { PatientFile } from '../../../../core/models/PatientFile';
import { PatientFileService } from '../../../../core/services/patient-file-service';
import { HttpErrorService } from '../../../../core/services/http-error-service';
import { Popup } from '../../../../components/popup/popup';
import { PatientLiveUpdatesService } from '../../../../core/services/patient-live-updates-service';

@Component({
  selector: 'app-files',
  imports: [
    Container,
    Popup,
    LucideChevronLeft,
    LucideChevronRight,
    LucideDownload,
    LucideFileImage,
    LucideUpload,
    LucideX,
    TranslatePipe,
  ],
  templateUrl: './files.html',
  styleUrl: './files.css',
})
export class Files implements OnChanges, OnDestroy {
  @Input() patientId = '';

  private readonly patientFileService = inject(PatientFileService);
  private readonly patientLiveUpdates = inject(PatientLiveUpdatesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly httpErrorService = inject(HttpErrorService);
  private readonly sanitizer = inject(DomSanitizer);
  readonly uploadedFiles = signal<PatientFile[]>([]);
  readonly imagePage = signal(0);
  readonly thumbnailUrls = signal<Record<string, string>>({});
  readonly selectedFiles = signal<File[]>([]);
  readonly fileError = signal('');
  readonly isLoading = signal(false);
  readonly isUploading = signal(false);
  readonly previewFile = signal<PatientFile | null>(null);
  readonly previewUrl = signal<string | null>(null);
  readonly previewResourceUrl = signal<SafeResourceUrl | null>(null);
  readonly isPreviewLoading = signal(false);
  private previewObjectUrl: string | null = null;
  private previewRequest: Subscription | null = null;
  private thumbnailRequest: Subscription | null = null;
  private readonly thumbnailObjectUrls = new Map<string, string>();

  constructor() {
    this.patientLiveUpdates.changes$
      .pipe(auditTime(150), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.patientId) this.loadFiles();
      });
  }

  ngOnDestroy(): void {
    this.clearPreviewUrl();
    this.clearThumbnails();
  }

  ngOnChanges(): void {
    if (!this.patientId) return;
    this.loadFiles();
  }

  private loadFiles(): void {
    this.isLoading.set(true);
    this.patientFileService.list(this.patientId).pipe(
      catchError((error) => {
        this.fileError.set(this.httpErrorService.message(error, 'Could not load patient files.'));
        return EMPTY;
      }),
      finalize(() => this.isLoading.set(false)),
    ).subscribe((files) => {
      this.clearThumbnails();
      this.uploadedFiles.set(files);
      this.imagePage.set(0);
      this.loadThumbnails(files.filter((file) => this.isImage(file)));
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target;
    if (input instanceof HTMLInputElement && input.files) {
      this.addFiles(Array.from(input.files));
      input.value = '';
    }
  }

  onFilesDropped(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      this.addFiles(Array.from(event.dataTransfer.files));
    }
  }

  removeSelectedFile(fileToRemove: File): void {
    this.selectedFiles.update((files) => files.filter((file) => file !== fileToRemove));
  }

  uploadSelectedFiles(): void {
    if (!this.patientId || this.isUploading()) return;
    this.fileError.set('');
    this.isUploading.set(true);
    from(this.selectedFiles()).pipe(
      concatMap((file) => this.patientFileService.upload(this.patientId, file).pipe(
        tap((uploaded) => {
          this.uploadedFiles.update((files) => [uploaded, ...files]);
          if (this.isImage(uploaded)) {
            this.imagePage.set(Math.floor((this.imageFiles().length - 1) / this.imagesPerPage));
          }
          this.removeSelectedFile(file);
        }),
        catchError((error) => {
          this.fileError.set(this.httpErrorService.message(error, 'Could not upload patient file.'));
          return EMPTY;
        }),
      )),
      finalize(() => this.isUploading.set(false)),
    ).subscribe();
  }

  previewFileContent(file: PatientFile): void {
    this.closePreview();
    this.previewFile.set(file);
    if (!this.isImage(file) && !this.isPdf(file)) return;

    this.isPreviewLoading.set(true);
    this.previewRequest = this.patientFileService.download(this.patientId, file.id).subscribe({
      next: (blob) => {
        this.previewObjectUrl = URL.createObjectURL(blob);
        this.previewUrl.set(this.previewObjectUrl);
        this.previewResourceUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.previewObjectUrl));
        this.isPreviewLoading.set(false);
      },
      error: (error) => {
        this.fileError.set(this.httpErrorService.message(error, 'Could not load file preview.'));
        this.isPreviewLoading.set(false);
        this.closePreview();
      },
    });
  }

  downloadFile(file: PatientFile): void {
    this.patientFileService.download(this.patientId, file.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.fileName;
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      },
      error: (error) => this.fileError.set(
        this.httpErrorService.message(error, 'Could not download patient file.'),
      ),
    });
  }

  closePreview(): void {
    this.previewRequest?.unsubscribe();
    this.previewRequest = null;
    this.clearPreviewUrl();
    this.previewFile.set(null);
    this.previewUrl.set(null);
    this.previewResourceUrl.set(null);
    this.isPreviewLoading.set(false);
  }

  imageFiles(): PatientFile[] {
    return this.uploadedFiles().filter((file) => this.isImage(file));
  }

  readonly imagesPerPage = 12;

  visibleImageFiles(): PatientFile[] {
    const start = this.imagePage() * this.imagesPerPage;
    return this.imageFiles().slice(start, start + this.imagesPerPage);
  }

  imagePageCount(): number {
    return Math.max(1, Math.ceil(this.imageFiles().length / this.imagesPerPage));
  }

  goToImagePage(page: number): void {
    this.imagePage.set(Math.min(Math.max(page, 0), this.imagePageCount() - 1));
  }

  documentFiles(): PatientFile[] {
    return this.uploadedFiles().filter((file) => !this.isImage(file));
  }

  previewImageNumber(): number {
    return this.imageFiles().findIndex((file) => file.id === this.previewFile()?.id) + 1;
  }

  showPreviousImage(): void {
    this.showImageAt(-1);
  }

  showNextImage(): void {
    this.showImageAt(1);
  }

  @HostListener('document:keydown', ['$event'])
  onViewerKeydown(event: KeyboardEvent): void {
    const current = this.previewFile();
    if (!current) return;
    if (event.key === 'Escape') {
      this.closePreview();
      return;
    }
    if (!this.isImage(current)) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.showPreviousImage();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.showNextImage();
    }
  }

  isImage(file: PatientFile): boolean {
    return file.contentType?.startsWith('image/') ?? false;
  }

  isPdf(file: PatientFile): boolean {
    return file.contentType === 'application/pdf' || file.fileName.toLowerCase().endsWith('.pdf');
  }

  deleteFile(file: PatientFile): void {
    this.patientFileService.delete(this.patientId, file.id).subscribe({
      next: () => {
        this.uploadedFiles.update((files) => files.filter((item) => item.id !== file.id));
        this.revokeThumbnail(file.id);
        this.goToImagePage(this.imagePage());
        if (this.previewFile()?.id === file.id) this.closePreview();
      },
      error: (error) => this.fileError.set(
        this.httpErrorService.message(error, 'Could not delete patient file.'),
      ),
    });
  }

  formatFileSize(size: number): string {
    if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  private addFiles(files: File[]): void {
    const allowedFiles = files.filter((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      return (
        file.type.startsWith('image/') ||
        file.type === 'application/pdf' ||
        extension === 'dcm' ||
        extension === 'dicom'
      );
    });

    this.fileError.set(
      allowedFiles.length === files.length
        ? ''
        : 'Unsupported file type. Choose images, PDF documents, or DICOM files.',
    );
    this.selectedFiles.update((currentFiles) => [...currentFiles, ...allowedFiles]);
  }

  private clearPreviewUrl(): void {
    if (this.previewObjectUrl) URL.revokeObjectURL(this.previewObjectUrl);
    this.previewObjectUrl = null;
  }

  private showImageAt(direction: number): void {
    const images = this.imageFiles();
    const currentIndex = images.findIndex((file) => file.id === this.previewFile()?.id);
    if (currentIndex < 0 || images.length < 2) return;
    const nextIndex = (currentIndex + direction + images.length) % images.length;
    this.previewFileContent(images[nextIndex]);
  }

  private loadThumbnails(files: PatientFile[]): void {
    if (!files.length) return;
    this.thumbnailRequest = from(files).pipe(
      mergeMap((file) => this.patientFileService.thumbnail(this.patientId, file.id).pipe(
        map((blob) => ({ id: file.id, url: URL.createObjectURL(blob) })),
        catchError(() => EMPTY),
      ), 4),
    ).subscribe((thumbnail) => {
      this.thumbnailObjectUrls.set(thumbnail.id, thumbnail.url);
      this.thumbnailUrls.update((urls) => ({ ...urls, [thumbnail.id]: thumbnail.url }));
    });
  }

  private clearThumbnails(): void {
    this.thumbnailRequest?.unsubscribe();
    this.thumbnailRequest = null;
    for (const url of this.thumbnailObjectUrls.values()) URL.revokeObjectURL(url);
    this.thumbnailObjectUrls.clear();
    this.thumbnailUrls.set({});
  }

  private revokeThumbnail(fileId: string): void {
    const url = this.thumbnailObjectUrls.get(fileId);
    if (url) URL.revokeObjectURL(url);
    this.thumbnailObjectUrls.delete(fileId);
    this.thumbnailUrls.update((urls) => {
      const updated = { ...urls };
      delete updated[fileId];
      return updated;
    });
  }
}
