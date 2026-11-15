import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { LucideGlobe, LucidePencil, LucidePlus, LucideTrash } from '@lucide/angular';
import { Button } from '../../components/custom-inputs/button/button';
import { ConfirmationDialog } from '../../components/confirmation-dialog/confirmation-dialog';
import { Container } from '../../components/container/container';
import { PageHeader } from '../../components/page-header/page-header';
import { TranslatePipe } from '../../core/pipes/translate-pipe';
import { HttpErrorService } from '../../core/services/http-error-service';
import { IpAddressService } from '../../core/services/ip-address-service';
import { IpAddress } from '../../core/models/IpAddress';
import { LanguageCode } from '../../core/data/language-translations';
import { LanguageService } from '../../core/services/language-service';

const IPV4_OCTET = '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)';
const IPV4_PATTERN = new RegExp(
  `^(?:(?:${IPV4_OCTET}\\.){3}${IPV4_OCTET}(?:/(?:3[0-2]|[12]?\\d))?|(?:${IPV4_OCTET}\\.){3}\\*)$`,
);

const ipAddressTranslations: Partial<Record<LanguageCode, Record<string, string>>> = {
  ro: {
    'Register one IPv4 address or a network range to allow its devices to access the API.':
      'Înregistrează o adresă IPv4 sau un interval de rețea pentru a permite accesul dispozitivelor la API.',
    'The first allowed address must be configured when the server starts. An empty list blocks all API access.':
      'Prima adresă permisă trebuie configurată la pornirea serverului. O listă goală blochează tot accesul la API.',
    'Name / location': 'Nume / locație',
    'For example, Chișinău office': 'De exemplu, sediul din Chișinău',
    'IPv4 address or range': 'Adresă IPv4 sau interval',
    'Register IP address': 'Înregistrează adresa IP',
    'Remove registered IP address': 'Elimină adresa IP înregistrată',
    'Remove this IP address? This computer may lose API access.':
      'Elimini această adresă IP? Acest computer poate pierde accesul la API.',
    'Loading registered IP addresses...': 'Se încarcă adresele IP înregistrate...',
    'No IP addresses are registered.': 'Nu există adrese IP înregistrate.',
    'You cannot remove the last registered address. Register another first.':
      'Nu poți elimina ultima adresă înregistrată. Înregistrează mai întâi o altă adresă.',
    'Enter a name (up to 100 characters).': 'Introdu un nume (maximum 100 de caractere).',
    'Enter a valid IPv4 address, wildcard, or CIDR range.': 'Introdu o adresă IPv4, un wildcard sau un interval CIDR valid.',
    'IP address registered.': 'Adresa IP a fost înregistrată.',
    'IP address name updated.': 'Numele adresei IP a fost actualizat.',
    'IP address removed.': 'Adresa IP a fost eliminată.',
    'Could not update IP address name.': 'Numele adresei IP nu a putut fi actualizat.',
    'Register a replacement IP before removing the old one.':
      'Înregistrează adresa IP nouă înainte de a o elimina pe cea veche.',
    'Edit IP address name': 'Editează numele adresei IP',
    'Could not load registered IP addresses.': 'Adresele IP înregistrate nu s-au putut încărca.',
    'Could not register this IP address.': 'Adresa IP nu a putut fi înregistrată.',
    'Could not remove this IP address.': 'Adresa IP nu a putut fi eliminată.',
  },
  ru: {
    'Register one IPv4 address or a network range to allow its devices to access the API.':
      'Зарегистрируйте IPv4-адрес или диапазон сети, чтобы разрешить устройствам доступ к API.',
    'The first allowed address must be configured when the server starts. An empty list blocks all API access.':
      'Первый разрешённый адрес нужно указать при запуске сервера. Пустой список блокирует весь доступ к API.',
    'Name / location': 'Название / расположение',
    'For example, Chișinău office': 'Например, офис в Кишинёве',
    'IPv4 address or range': 'IPv4-адрес или диапазон',
    'Register IP address': 'Зарегистрировать IP-адрес',
    'Remove registered IP address': 'Удалить зарегистрированный IP-адрес',
    'Remove this IP address? This computer may lose API access.':
      'Удалить этот IP-адрес? Этот компьютер может потерять доступ к API.',
    'Loading registered IP addresses...': 'Загрузка зарегистрированных IP-адресов...',
    'No IP addresses are registered.': 'Нет зарегистрированных IP-адресов.',
    'You cannot remove the last registered address. Register another first.':
      'Нельзя удалить последний адрес. Сначала зарегистрируйте другой.',
    'Enter a name (up to 100 characters).': 'Введите название (до 100 символов).',
    'Enter a valid IPv4 address, wildcard, or CIDR range.': 'Введите корректный IPv4-адрес, шаблон или диапазон CIDR.',
    'IP address registered.': 'IP-адрес зарегистрирован.',
    'IP address name updated.': 'Название IP-адреса обновлено.',
    'IP address removed.': 'IP-адрес удалён.',
    'Could not update IP address name.': 'Не удалось изменить название IP-адреса.',
    'Register a replacement IP before removing the old one.':
      'Зарегистрируйте новый IP-адрес перед удалением старого.',
    'Edit IP address name': 'Изменить название IP-адреса',
    'Could not load registered IP addresses.': 'Не удалось загрузить зарегистрированные IP-адреса.',
    'Could not register this IP address.': 'Не удалось зарегистрировать этот IP-адрес.',
    'Could not remove this IP address.': 'Не удалось удалить этот IP-адрес.',
  },
};

@Component({
  selector: 'app-ip-address-management',
  imports: [
    ReactiveFormsModule,
    Button,
    ConfirmationDialog,
    Container,
    PageHeader,
    TranslatePipe,
    LucideGlobe,
    LucidePencil,
    LucidePlus,
    LucideTrash,
  ],
  templateUrl: './ip-address-management.html',
})
export class IpAddressManagement implements OnInit {
  private readonly ipAddressService = inject(IpAddressService);
  private readonly httpErrorService = inject(HttpErrorService);
  private readonly languageService = inject(LanguageService);
  private readonly formBuilder = inject(FormBuilder);

  readonly addresses = signal<IpAddress[]>([]);
  readonly isLoading = signal(true);
  readonly isSubmitting = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly deletingId = signal<string | null>(null);
  readonly addressToDelete = signal<IpAddress | null>(null);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)]],
    address: ['', [Validators.required, Validators.pattern(IPV4_PATTERN)]],
  });

  text(value: string): string {
    return ipAddressTranslations[this.languageService.language()]?.[value] ?? value;
  }

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.ipAddressService
      .getAll()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (addresses) => this.addresses.set(addresses),
        error: (error) => {
          console.error(error);
          this.errorMessage.set(
            this.httpErrorService.message(
              error,
              this.text('Could not load registered IP addresses.'),
            ),
          );
        },
      });
  }

  saveAddress(): void {
    if (this.isSubmitting()) return;

    this.errorMessage.set('');
    this.successMessage.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.form.getRawValue();
    const editingId = this.editingId();
    const request = editingId
      ? this.ipAddressService.updateName(editingId, { name: formValue.name.trim() })
      : this.ipAddressService.create({
          name: formValue.name.trim(),
          address: formValue.address.trim(),
        });

    request
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.cancelEdit();
          this.successMessage.set(
            this.text(editingId ? 'IP address name updated.' : 'IP address registered.'),
          );
          this.loadAddresses();
        },
        error: (error) => {
          console.error(error);
          this.errorMessage.set(
            this.httpErrorService.message(
              error,
              this.text(editingId ? 'Could not update IP address name.' : 'Could not register this IP address.'),
            ),
          );
        },
      });
  }

  editAddress(address: IpAddress): void {
    if (this.isSubmitting() || this.deletingId()) return;

    this.errorMessage.set('');
    this.successMessage.set('');
    this.editingId.set(address.id);
    this.form.controls.address.disable();
    this.form.setValue({ name: address.name, address: address.address });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.controls.address.enable();
    this.form.reset();
  }

  requestDelete(address: IpAddress): void {
    if (this.addresses().length <= 1 || this.deletingId() || this.isSubmitting() || this.editingId()) {
      return;
    }
    this.addressToDelete.set(address);
  }

  confirmDelete(): void {
    const address = this.addressToDelete();
    if (!address || this.deletingId()) return;

    this.addressToDelete.set(null);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.deletingId.set(address.id);
    this.ipAddressService
      .delete(address.id)
      .pipe(finalize(() => this.deletingId.set(null)))
      .subscribe({
        next: () => {
          this.addresses.update((addresses) => addresses.filter((item) => item.id !== address.id));
          this.successMessage.set(this.text('IP address removed.'));
        },
        error: (error) => {
          console.error(error);
          this.errorMessage.set(
            this.httpErrorService.message(error, this.text('Could not remove this IP address.')),
          );
        },
      });
  }
}
