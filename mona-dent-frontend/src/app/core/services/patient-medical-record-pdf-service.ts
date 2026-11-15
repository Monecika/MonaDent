import { Injectable } from '@angular/core';
import { PatientResponse } from '../models/Patient';
import { PatientToothHistoryResponse, PatientToothResponse } from '../models/PatientTooth';
import { VisitResponse } from '../models/Visit';
import type { LanguageCode } from './language-service';

type ReportLanguage = 'ro' | 'ru' | 'en';

const labels: Record<ReportLanguage, Record<string, string>> = {
  ro: {
    title: 'Fișă medicală', generated: 'Generată la', patientInfo: 'Date pacient', fullName: 'Nume complet',
    birthDate: 'Data nașterii', phone: 'Telefon', patientId: 'Cod pacient', period: 'Perioada', allDates: 'Toată perioada',
    appointments: 'Programări', visits: 'Vizite și tratamente', noAppointments: 'Nu există programări în această perioadă.',
    noVisits: 'Nu există vizite în această perioadă.', doctor: 'Medic', date: 'Data', duration: 'Durată', status: 'Stare',
    noTeeth: 'Nu sunt înregistrați dinți pentru acest pacient.',
    treatment: 'Tratament / procedură', notes: 'Note', currentTeeth: 'Starea curentă a dinților', tooth: 'Dinte',
    type: 'Tip', history: 'Istoricul modificărilor dentare în perioadă', noHistory: 'Nu există modificări dentare în această perioadă.',
    changedAt: 'Modificat la', change: 'Modificare', from: 'din', to: 'în', notAssessed: 'Neevaluat', healthy: 'Sănătos',
    caries: 'Carie', pulpitis: 'Pulpită', periodontitis: 'Periodontită', periodontalDisease: 'Parodontoză',
    rootProblem: 'Rădăcină', filling: 'Plombat', implant: 'Implant', crown: 'Coroană', missing: 'Lipsește', primary: 'Temporar', permanent: 'Permanent',
    scheduled: 'Programată', inProgress: 'În desfășurare', completed: 'Finalizată', cancelled: 'Anulată', noShow: 'Neprezentare',
    intro: 'Prezenta fișă medicală este întocmită pentru pacientul {name} și rezumă vizitele și constatările dentare documentate de clinică.',
    clinicalChange: 'Starea clinică s-a modificat de la {old} la {new}.',
    findingsChange: 'Constatări: {old} → {new}.', mobilityChange: 'Mobilitate: {old} → {new}.',
    toothAdded: 'A fost adăugat dintele {type} {number}.',
    toothReplaced: 'Dintele {oldNumber} ({oldType}) a fost înlocuit cu dintele {newNumber} ({newType}).',
    notesUpdated: 'Notele au fost actualizate.',
    recordUpdated: 'Fișa dintelui a fost actualizată.',
    healthyMark: 'Sănătos', problemMark: 'Problemă', missingMark: 'Lipsește',
    legend: '⚠ Problemă · ✓ Sănătos · × Lipsă',
    minutes: 'min',
  },
  ru: {
    title: 'Медицинская карта', generated: 'Создана', patientInfo: 'Данные пациента', fullName: 'Полное имя',
    birthDate: 'Дата рождения', phone: 'Телефон', patientId: 'Код пациента', period: 'Период', allDates: 'За всё время',
    appointments: 'Записи', visits: 'Визиты и лечение', noAppointments: 'За этот период записей нет.',
    noVisits: 'За этот период визитов нет.', doctor: 'Врач', date: 'Дата', duration: 'Длительность', status: 'Статус',
    noTeeth: 'У пациента нет зарегистрированных зубов.',
    treatment: 'Лечение / процедура', notes: 'Примечания', currentTeeth: 'Текущее состояние зубов', tooth: 'Зуб',
    type: 'Тип', history: 'Изменения зубов за период', noHistory: 'За этот период изменений зубов нет.',
    changedAt: 'Изменено', change: 'Изменение', from: 'с', to: 'на', notAssessed: 'Не оценён', healthy: 'Здоровый',
    caries: 'Кариес', pulpitis: 'Пульпит', periodontitis: 'Периодонтит', periodontalDisease: 'Пародонтоз',
    rootProblem: 'Корень', filling: 'Пломба', implant: 'Имплант', crown: 'Коронка', missing: 'Отсутствует', primary: 'Молочный', permanent: 'Постоянный',
    scheduled: 'Запланирована', inProgress: 'В процессе', completed: 'Завершена', cancelled: 'Отменена', noShow: 'Неявка',
    intro: 'Настоящая медицинская карта составлена для пациента {name} и содержит сведения о визитах и стоматологических наблюдениях, задокументированных клиникой.',
    clinicalChange: 'Клинический статус изменён с «{old}» на «{new}».',
    findingsChange: 'Находки: {old} → {new}.', mobilityChange: 'Подвижность: {old} → {new}.',
    toothAdded: 'Добавлен {type} зуб {number}.',
    toothReplaced: '{typeOld} зуб {oldNumber} заменён на {typeNew} зуб {newNumber}.',
    notesUpdated: 'Примечания обновлены.',
    recordUpdated: 'Запись о зубе обновлена.',
    healthyMark: 'Здоровый', problemMark: 'Проблема', missingMark: 'Отсутствует',
    legend: '⚠ Проблема · ✓ Здоровый · × Отсутствует',
    minutes: 'мин',
  },
  en: {
    title: 'Medical Record', generated: 'Generated on', patientInfo: 'Patient Information', fullName: 'Full name',
    birthDate: 'Date of birth', phone: 'Phone', patientId: 'Patient ID', period: 'Date range', allDates: 'All dates',
    appointments: 'Appointments', visits: 'Visits and Treatment', noAppointments: 'No appointments in this date range.',
    noVisits: 'No visits in this date range.', doctor: 'Doctor', date: 'Date', duration: 'Duration', status: 'Status',
    noTeeth: 'No teeth are recorded for this patient.',
    treatment: 'Treatment / procedure', notes: 'Notes', currentTeeth: 'Current Tooth Status', tooth: 'Tooth',
    type: 'Type', history: 'Tooth Changes in Date Range', noHistory: 'No tooth changes in this date range.',
    changedAt: 'Changed on', change: 'Change', from: 'from', to: 'to', notAssessed: 'Not assessed', healthy: 'Healthy',
    caries: 'Caries', pulpitis: 'Pulpitis', periodontitis: 'Periodontitis', periodontalDisease: 'Periodontal disease',
    rootProblem: 'Root problem', filling: 'Filling', implant: 'Implant', crown: 'Crown', missing: 'Missing', primary: 'Primary', permanent: 'Permanent',
    scheduled: 'Scheduled', inProgress: 'In progress', completed: 'Completed', cancelled: 'Cancelled', noShow: 'No-show',
    intro: 'This medical record is prepared for {name} and summarizes the visits and dental findings documented by the clinic.',
    clinicalChange: 'Clinical status changed from {old} to {new}.',
    findingsChange: 'Findings: {old} → {new}.', mobilityChange: 'Mobility: {old} → {new}.',
    toothAdded: 'Added {type} tooth {number}.',
    toothReplaced: 'Tooth {oldNumber} ({oldType}) was replaced by tooth {newNumber} ({newType}).',
    notesUpdated: 'Notes were updated.',
    recordUpdated: 'The tooth record was updated.',
    healthyMark: 'Healthy', problemMark: 'Problem', missingMark: 'Missing',
    legend: '⚠ Problem · ✓ Healthy · × Missing',
    minutes: 'min',
  },
};

@Injectable({ providedIn: 'root' })
export class PatientMedicalRecordPdfService {
  writePrintView(
    printWindow: Window,
    patient: PatientResponse,
    visits: VisitResponse[],
    teeth: PatientToothResponse[],
    toothHistory: PatientToothHistoryResponse[],
    language: LanguageCode,
    dateFrom: string,
    dateTo: string,
  ): void {
    const lang: ReportLanguage = language;
    const t = (key: string) => labels[lang][key] ?? key;
    const legacyFinding = (status?: string, presenceStatus?: string): string[] => {
      if (presenceStatus === 'EXTRACTED' || presenceStatus === 'CONGENITALLY_MISSING') return ['MISSING'];
      const mapped: Record<string, string> = {
        NOT_ASSESSED: 'NOT_ASSESSED', HEALTHY: 'HEALTHY', CARIES_ACTIVE: 'CARIES', CARIES_TREATED: 'FILLING',
        ROOT_PROBLEM: 'ROOT_PROBLEM', ROOT_TREATED: 'FILLING', IMPLANT: 'IMPLANT', CROWN: 'CROWN',
        MISSING: 'MISSING', EXTRACTED: 'MISSING',
      };
      const finding = status ? mapped[status] : undefined;
      return finding ? [finding] : ['NOT_ASSESSED'];
    };
    const findingsForTooth = (tooth: PatientToothResponse): string[] => {
      const legacy = tooth as PatientToothResponse & { status?: string; presenceStatus?: string };
      return Array.isArray(tooth.findings)
        ? (tooth.findings as string[]).map((finding) => finding === 'EXTRACTED' ? 'MISSING' : finding)
        : legacyFinding(legacy.status, legacy.presenceStatus);
    };
    const historyFindings = (history: PatientToothHistoryResponse, side: 'old' | 'new'): string[] => {
      const legacy = history as PatientToothHistoryResponse & {
        oldStatus?: string; newStatus?: string; oldPresenceStatus?: string; newPresenceStatus?: string;
      };
      const values = side === 'old' ? history.oldFindings : history.newFindings;
      return Array.isArray(values)
        ? (values as string[]).map((finding) => finding === 'EXTRACTED' ? 'MISSING' : finding)
        : legacyFinding(
            side === 'old' ? legacy.oldStatus : legacy.newStatus,
            side === 'old' ? legacy.oldPresenceStatus : legacy.newPresenceStatus,
          );
    };
    const inRange = (value: string | undefined) => {
      if (!value) return false;
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return false;
      const localDay = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}`;
      return (!dateFrom || localDay >= dateFrom) && (!dateTo || localDay <= dateTo);
    };
    const date = (value: string) => {
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? '—' : new Intl.DateTimeFormat(lang, { dateStyle: 'medium', timeStyle: 'short' }).format(parsed);
    };
    const day = (value: string) => {
      const parsed = new Date(`${value}T12:00:00`);
      return Number.isNaN(parsed.getTime()) ? '—' : new Intl.DateTimeFormat(lang, { dateStyle: 'medium' }).format(parsed);
    };
    const safe = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]!);
    const visitList = visits.filter((item) => inRange(item.visitDate));
    const historyList = toothHistory.filter((item) => inRange(item.changedAt)).sort((a, b) =>
      (b.changedAt ?? '').localeCompare(a.changedAt ?? ''),
    );
    const rangeText = dateFrom || dateTo
      ? `${dateFrom ? day(dateFrom) : '…'} – ${dateTo ? day(dateTo) : '…'}`
      : t('allDates');
    const statusLabel = (status: string) => t(({ NOT_ASSESSED: 'notAssessed', HEALTHY: 'healthy', CARIES: 'caries',
      PULPITIS: 'pulpitis', PERIODONTITIS: 'periodontitis', PERIODONTAL_DISEASE: 'periodontalDisease',
      ROOT_PROBLEM: 'rootProblem', FILLING: 'filling', IMPLANT: 'implant', CROWN: 'crown',
      MISSING: 'missing',
      PRIMARY: 'primary', PERMANENT: 'permanent', SCHEDULED: 'scheduled', IN_PROGRESS: 'inProgress', COMPLETED: 'completed',
      CANCELLED: 'cancelled', NO_SHOW: 'noShow',
    } as Record<string, string>)[status] ?? status);
    const fill = (key: string, values: Record<string, string>) => Object.entries(values).reduce(
      (message, [name, value]) => message.replaceAll(`{${name}}`, value), t(key),
    );
    const toothIndicator = (findings: string[]): { mark: string; label: string; kind: string } => {
      if (findings.includes('MISSING')) {
        return { mark: '×', label: t('missingMark'), kind: 'missing' };
      }
      if (findings.some((finding) => ['CARIES', 'PULPITIS', 'PERIODONTITIS', 'PERIODONTAL_DISEASE', 'ROOT_PROBLEM'].includes(finding))) {
        return { mark: '⚠', label: t('problemMark'), kind: 'problem' };
      }
      if (findings.includes('HEALTHY') || findings.includes('FILLING') || findings.includes('CROWN')) {
        return { mark: '✓', label: t('healthyMark'), kind: 'healthy' };
      }
      return { mark: '', label: '', kind: '' };
    };
    const isValidToothNumber = (number: number, toothType: PatientToothResponse['toothType']) => {
      const quadrant = Math.floor(number / 10);
      const position = number % 10;
      return Number.isInteger(number) && (toothType === 'PERMANENT'
        ? quadrant >= 1 && quadrant <= 4 && position >= 1 && position <= 8
        : quadrant >= 5 && quadrant <= 8 && position >= 1 && position <= 5);
    };
    const validTeeth = teeth.filter((item) =>
      item.patientId === patient.patientId
      && isValidToothNumber(item.toothNumber, item.toothType),
    );
    const physicalPosition = (item: PatientToothResponse) => {
      const quadrant = Math.floor(item.toothNumber / 10);
      return `${quadrant > 4 ? quadrant - 4 : quadrant}:${item.toothNumber % 10}`;
    };
    const uniqueTeeth = validTeeth.filter((item) =>
      validTeeth.filter((candidate) => physicalPosition(candidate) === physicalPosition(item)).length === 1,
    );
    const isUpperTooth = (item: PatientToothResponse) => [1, 2, 5, 6].includes(Math.floor(item.toothNumber / 10));
    const isRightSideTooth = (item: PatientToothResponse) => {
      const quadrant = Math.floor(item.toothNumber / 10);
      return isUpperTooth(item) ? [1, 5].includes(quadrant) : [4, 8].includes(quadrant);
    };
    const sortArch = (arch: 'upper' | 'lower') => uniqueTeeth
      .filter((item) => (isUpperTooth(item) ? 'upper' : 'lower') === arch)
      .sort((a, b) => {
        const sideDifference = Number(isRightSideTooth(b)) - Number(isRightSideTooth(a));
        if (sideDifference) return sideDifference;
        const positionDifference = a.toothNumber % 10 - b.toothNumber % 10;
        return isRightSideTooth(a) ? -positionDifference : positionDifference;
      });
    const chartMarkFor = (item: PatientToothResponse) => {
      const findings = findingsForTooth(item);
      if (findings.includes('MISSING') || findings.includes('IMPLANT')) {
        return findings.includes('MISSING') ? 'L' : 'I';
      }
      if (findings.includes('NOT_ASSESSED')
        || (findings.includes('HEALTHY')
          && findings.some((finding) => ['CARIES', 'PULPITIS', 'PERIODONTITIS', 'PERIODONTAL_DISEASE', 'ROOT_PROBLEM'].includes(finding)))) {
        return '';
      }
      return findings.map((finding) => ({
        HEALTHY: '✓',
        CARIES: 'C', PULPITIS: 'P', PERIODONTITIS: 'Pt', PERIODONTAL_DISEASE: 'A', ROOT_PROBLEM: 'R',
        FILLING: 'Pl', CROWN: 'Cr',
      } as Record<string, string>)[finding] ?? '').filter(Boolean).join(' ');
    };
    const upperTeeth = sortArch('upper');
    const lowerTeeth = sortArch('lower');
    const toothCellHtml = (item: PatientToothResponse) =>
      `<div class="tooth-cell"><div class="tooth-number">${item.toothNumber}</div><div class="tooth-mark">${safe(chartMarkFor(item)) || '&nbsp;'}</div></div>`;
    const toothArchHtml = (archTeeth: PatientToothResponse[]) => archTeeth.length
      ? `<div class="tooth-arch" style="grid-template-columns:repeat(${archTeeth.length}, minmax(0, 1fr));width:${archTeeth.length * 38}px">${archTeeth.map(toothCellHtml).join('')}</div>`
      : '';
    const historyDescription = (item: PatientToothHistoryResponse): string => {
      if (item.eventType === 'TOOTH_ADDED') {
        return fill('toothAdded', { type: statusLabel(item.toothType), number: String(item.toothNumber) });
      }
      if (item.eventType === 'TOOTH_REPLACED') {
        return fill('toothReplaced', {
          oldType: statusLabel(item.previousToothType ?? ''),
          newType: statusLabel(item.toothType),
          typeOld: statusLabel(item.previousToothType ?? ''),
          typeNew: statusLabel(item.toothType),
          oldNumber: String(item.previousToothNumber ?? item.toothNumber),
          newNumber: String(item.toothNumber),
        });
      }
      const changes: string[] = [];
      const oldFindings = historyFindings(item, 'old');
      const newFindings = historyFindings(item, 'new');
      if (JSON.stringify(oldFindings) !== JSON.stringify(newFindings)) {
        changes.push(fill('findingsChange', {
          old: oldFindings.map(statusLabel).join(', '), new: newFindings.map(statusLabel).join(', '),
        }));
      }
      if (item.oldMobilityGrade !== item.newMobilityGrade) {
        changes.push(fill('mobilityChange', {
          old: item.oldMobilityGrade ? ['I', 'II', 'III'][item.oldMobilityGrade - 1] : '—',
          new: item.newMobilityGrade ? ['I', 'II', 'III'][item.newMobilityGrade - 1] : '—',
        }));
      }
      if (!changes.length && /notes updated/i.test(item.description ?? '')) changes.push(t('notesUpdated'));
      return changes.join(' ') || t('recordUpdated');
    };
    const historyDescriptionHtml = (item: PatientToothHistoryResponse): string => {
      const formatted = (key: string, values: Record<string, string>) => Object.entries(values).reduce(
        (message, [name, value]) => message.replaceAll(`{${name}}`, `<strong>${safe(value)}</strong>`),
        safe(t(key)),
      );
      const changes: string[] = [];
      const oldFindings = historyFindings(item, 'old');
      const newFindings = historyFindings(item, 'new');
      if (JSON.stringify(oldFindings) !== JSON.stringify(newFindings)) {
        changes.push(formatted('findingsChange', {
          old: oldFindings.map(statusLabel).join(', '),
          new: newFindings.map(statusLabel).join(', '),
        }));
      }
      if (item.oldMobilityGrade !== item.newMobilityGrade) {
        changes.push(formatted('mobilityChange', {
          old: item.oldMobilityGrade ? ['I', 'II', 'III'][item.oldMobilityGrade - 1] : '—',
          new: item.newMobilityGrade ? ['I', 'II', 'III'][item.newMobilityGrade - 1] : '—',
        }));
      }
      return changes.length ? changes.join('<br>') : safe(historyDescription(item));
    };
    const section = (title: string, content: string) => `<section><h2>${safe(title)}</h2>${content}</section>`;
    const empty = (message: string) => `<p class="muted">${safe(message)}</p>`;
    const visitHtml = visitList.length ? visitList.map((item) => `
      <article class="record">
        <div class="record-heading"><strong>${safe(date(item.visitDate))}</strong><span>${safe(statusLabel(item.status))}</span></div>
        <p>${safe(t('doctor'))}: ${safe(`${item.doctorName} ${item.doctorSurname}`)} · ${item.durationMinutes} ${safe(t('minutes'))}</p>
        ${item.description ? `<p><b>${safe(t('treatment'))}:</b> ${safe(item.description)}</p>` : ''}
        ${item.notes ? `<p><b>${safe(t('notes'))}:</b> ${safe(item.notes)}</p>` : ''}
      </article>`).join('') : empty(t('noVisits'));
    const diseaseEvolutionText = visitList.slice(0, 2)
      .map((visit) => visit.notes || visit.description)
      .filter(Boolean)
      .join('; ');
    const toothHtml = teeth.length ? `<p class="legend">${safe(t('legend'))}</p><div class="tooth-grid">${[...teeth].sort((a, b) => a.toothNumber - b.toothNumber).map((item) => {
      const findings = findingsForTooth(item);
      const indicator = toothIndicator(findings);
      return `<div class="tooth"><strong>${indicator.mark ? `<span class="indicator ${indicator.kind}" aria-label="${safe(indicator.label)}">${indicator.mark}</span> ` : ''}${safe(t('tooth'))} ${item.toothNumber}</strong><span>${safe(findings.map(statusLabel).join(', '))}</span><small>${safe(statusLabel(item.toothType))}${item.mobilityGrade ? ` · ${['I', 'II', 'III'][item.mobilityGrade - 1]}` : ''}</small>${item.notes ? `<small>${safe(item.notes)}</small>` : ''}</div>`;
    }).join('')}</div>` : empty('—');
    const historyHtml = historyList.length ? historyList.map((item) => `
      <article class="record">
        <div class="record-heading"><strong>${safe(t('tooth'))} ${item.toothNumber} · ${safe(statusLabel(item.toothType))}</strong><span>${safe(item.changedAt ? date(item.changedAt) : '')}</span></div>
        <p>${historyDescriptionHtml(item)}</p>
        ${item.notes ? `<p><b>${safe(t('notes'))}:</b> ${safe(item.notes)}</p>` : ''}
      </article>`).join('') : empty(t('noHistory'));

    printWindow.document.open();
    printWindow.document.write(`<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${safe(t('title'))} - ${safe(patient.name)} ${safe(patient.surname)}</title>
      <style>
        @page { size: A4; margin: 12mm 14mm; }
        * { box-sizing: border-box; }
        body { margin: 0; color: #111; font: 9pt/1.25 "Times New Roman", serif; }
        .top { display:flex; justify-content:space-between; font-size:8pt; margin-bottom:10px; }
        .top strong { font-size:10pt; }
        h1 { margin: 10px 0 12px; text-align:center; font-size:15pt; font-weight:normal; }
        .formline { min-height:20px; border-bottom:1px solid #333; padding:2px 0; }
        .row { display:flex; gap:12px; align-items:end; margin:3px 0; }
        .date-row { display:flex; justify-content:center; align-items:end; gap:9px; margin:3px 0; }
        .date-field { height:20px; border-bottom:1px solid #333; }
        .date-field.day { width:38px; }
        .date-field.month { width:72px; }
        .field { flex:1; border-bottom:1px solid #333; min-height:20px; padding:2px 4px; }
        .label { white-space:nowrap; }
        .section { margin-top:5px; }
        .section-title { display:inline-block; white-space:nowrap; }
        .section-heading { display:flex; align-items:end; gap:3px; width:100%; }
        .section-heading .field { display:block; min-width:0; }
        .occlusion-row { display:grid; grid-template-columns:max-content minmax(0, 1fr) max-content minmax(0, 1fr); align-items:end; column-gap:6px; }
        .occlusion-row .field { display:block; min-width:0; }
        .ruled { height:19px; border-bottom:1px solid #555; }
        .tooth-area { display:block; margin:7px 0; }
        .legend { margin-bottom:5px; font-size:8pt; }
        .tooth-chart { display:flex; flex-direction:column; gap:5px; width:100%; }
        .tooth-arch { display:grid; max-width:100%; margin:0 auto; }
        .tooth-cell { display:flex; flex-direction:column; min-width:0; height:44px; border:1px solid #555; text-align:center; }
        .tooth-cell + .tooth-cell { border-left:0; }
        .tooth-number { display:flex; min-height:21px; align-items:center; justify-content:center; border-bottom:1px solid #777; font-size:8pt; }
        .tooth-mark { display:flex; flex:1; align-items:center; justify-content:center; min-width:0; padding:0 1px; font-size:6.5pt; white-space:nowrap; }
        .signature { display:flex; gap:40px; margin-top:24px; }
        .signature div { display:flex; flex:1; align-items:end; gap:6px; padding-bottom:4px; }
        .signature-line { flex:1; min-width:24px; height:1em; border-bottom:1px solid #333; }
        .muted { color:#555; }
        @media print { body { print-color-adjust:exact; -webkit-print-color-adjust:exact; } }
      </style></head><body>
      <div class="top"><strong>Clinica Stomatologică Cudalb Dent</strong><div style="text-align:right">Documentație medicală<br>Formular Nr. 043/e<br>Aprobat de MS al RM nr. 828 din 31.10.2011</div></div>
      <h1>FIȘA MEDICALĂ A BOLNAVULUI STOMATOLOGIC Nr. ________</h1>
      <div class="date-row"><div class="date-field day"></div><div class="date-field month"></div><span>${new Date().getFullYear()}</span></div>
      <div class="row"><span class="label">Nume, prenume</span><div class="field">${safe(`${patient.name} ${patient.surname}`)}</div><span class="label">a/n</span><div class="field" style="max-width:100px">${safe(day(patient.dateOfBirth))}</div></div>
      <div class="row"><span class="label">Sex M / F, IDNP</span><div class="field"></div><span class="label">Profesia</span><div class="field"></div><span class="label">Tel:</span><div class="field">${safe(patient.phone)}</div></div>
      <div class="row"><span class="label">Adresa la domiciliu</span><div class="field"></div><span class="label">Locul de muncă</span><div class="field"></div></div>
      <div class="section"><div class="section-heading"><span class="section-title">Diagnosticul</span><span class="field">${safe(visitList[0]?.description ?? '')}</span></div><div class="ruled"></div></div>
      <div class="section"><div class="section-heading"><span class="section-title">Acuzе</span><span class="field">${safe(visitList[0]?.notes ?? '')}</span></div><div class="ruled"></div></div>
      <div class="row"><span>Boli antecedente și concomitente C/O-</span><div class="field"></div><span>Hepatită</span><div class="field"></div><span>Alergii</span><div class="field"></div></div>
      <div class="section"><div class="section-heading"><span class="section-title">Evoluția actualei maladie</span><span class="field">${safe(diseaseEvolutionText)}</span></div><div class="ruled"></div></div>
      <div class="section"><div class="section-heading"><span class="section-title">Examen extraoral</span><span class="field"></span></div><div class="ruled"></div></div>
      <div class="section"><div class="section-heading"><span class="section-title">Examen intraoral</span><span class="field"></span></div><div class="ruled"></div></div>
      ${uniqueTeeth.length ? `<div class="tooth-area"><div class="legend">Semne convenționale: lipsă – L, carie – C, pulpită – P, periodontită – Pt, rădăcină – R, plombat – Pl, coroană – Cr, implant – I, sănătos – ✓</div><div class="tooth-chart">${toothArchHtml(upperTeeth)}${toothArchHtml(lowerTeeth)}</div></div>` : `<p class="legend">${safe(t('noTeeth'))}</p>`}
      <div class="section occlusion-row"><span>Raport de ocluzie</span><span class="field"></span><span>Tip de ocluzie</span><span class="field"></span></div>
      <div class="section"><div class="section-heading"><span class="section-title">Starea mucoasei bucale</span><span class="field"></span></div><div class="ruled"></div></div>
      <div class="section"><div class="section-heading"><span class="section-title">Investigații paraclinice</span><span class="field"></span></div><div class="ruled"></div></div>
      <div class="section"><div class="section-heading"><span class="section-title">Plan de tratament</span><span class="field"></span></div><div class="ruled"></div><div class="ruled"></div><div class="ruled"></div></div>
      <div class="section"><div class="section-heading"><span class="section-title">Epicriza</span><span class="field"></span></div><div class="ruled"></div></div>
      <div class="section"><div class="section-heading"><span class="section-title">Recomandări practice</span><span class="field"></span></div><div class="ruled"></div></div>
      <div class="section"><div class="section-heading"><span class="section-title">Grupa de dispensarizare</span><span class="field"></span></div><div class="ruled"></div></div>
      <div class="signature"><div><span>Medic curant</span><span class="signature-line"></span></div><div><span>Șef secție</span><span class="signature-line"></span></div></div>
      <script>window.addEventListener('load', function(){ setTimeout(function(){ window.focus(); window.print(); }, 250); });</script>
      </body></html>`);
    printWindow.document.close();
  }
}
