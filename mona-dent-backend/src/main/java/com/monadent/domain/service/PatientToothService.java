package com.monadent.domain.service;

import com.monadent.application.port.PatientToothManagement;
import com.monadent.application.security.AuthenticatedUserProvider;
import com.monadent.contracts.teeth.CreatePatientToothRequest;
import com.monadent.contracts.teeth.PatientToothHistoryResponse;
import com.monadent.contracts.teeth.PatientToothResponse;
import com.monadent.contracts.teeth.UpdatePatientToothRequest;
import com.monadent.domain.enums.ToothFinding;
import com.monadent.domain.enums.ToothType;
import com.monadent.domain.exception.BaseException;
import com.monadent.domain.exception.ErrorCode;
import com.monadent.domain.models.entity.PatientTooth;
import com.monadent.domain.models.entity.ToothHistory;
import com.monadent.infrastructure.mapper.PatientToothMapper;
import com.monadent.infrastructure.persistence.PatientJpaRepository;
import com.monadent.infrastructure.persistence.PatientToothJpaRepository;
import com.monadent.infrastructure.persistence.ToothHistoryJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import static com.monadent.contracts.teeth.ToothType.valueOf;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientToothService implements PatientToothManagement {
    private final PatientJpaRepository patientJpaRepository;
    private final PatientToothJpaRepository patientToothJpaRepository;
    private final ToothHistoryJpaRepository toothHistoryJpaRepository;
    private final AuthenticatedUserProvider authenticatedUserProvider;
    private final PatientToothMapper patientToothMapper;

    @Override
    @Transactional(readOnly = true)
    public List<PatientToothResponse> getPatientTeeth(UUID patientId) {
        ensurePatientExists(patientId);
        return patientToothJpaRepository
                .findAllByPatientIdAndCurrentTrueOrderByToothNumber(patientId).stream()
                .map(patientToothMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientToothHistoryResponse> getPatientToothHistory(UUID patientId) {
        ensurePatientExists(patientId);
        var toothIds = patientToothJpaRepository.findAllByPatientIdOrderByToothNumber(patientId)
                .stream()
                .map(PatientTooth::getId)
                .toList();
        if (toothIds.isEmpty()) {
            return List.of();
        }
        return toothHistoryJpaRepository.findAllByPatientToothIdInOrderByChangedAtDesc(toothIds)
                .stream()
                .map(this::toHistoryResponse)
                .toList();
    }

    @Override
    public PatientToothResponse addPatientTooth(UUID patientId, CreatePatientToothRequest request) {
        ensurePatientExists(patientId);
        var tooth = patientToothMapper.toPatientTooth(request);
        validateToothNumberAndType(tooth.getToothNumber(), tooth.getToothType());
        tooth.setFindings(normalizeFindings(tooth.getFindings()));
        validateMobilityGrade(tooth.getMobilityGrade());
        validateMobilityCompatibleWithFindings(tooth.getFindings(), tooth.getMobilityGrade());
        var updatedBy = authenticatedUserProvider.requireUserDetails().getId();
        var currentTeeth = patientToothJpaRepository
                .findAllByPatientIdAndCurrentTrueOrderByToothNumber(patientId);
        var toothInPosition = currentTeeth.stream()
                .filter(existing -> samePosition(existing.getToothNumber(), tooth.getToothNumber()))
                .findFirst();
        var replacedTooth = toothInPosition.orElse(null);
        if (replacedTooth != null) {
            var existing = replacedTooth;
            if (existing.getToothType() == tooth.getToothType()) {
                throw new BaseException(
                        HttpStatus.CONFLICT.value(),
                        ErrorCode.DUPLICATE_PATIENT_TOOTH);
            }
            existing.setCurrent(false);
            existing.setUpdatedBy(updatedBy);
            patientToothJpaRepository.saveAndFlush(existing);
        }

        tooth.setPatientId(patientId);
        tooth.setUpdatedBy(updatedBy);
        tooth.setCurrent(true);
        var savedTooth = patientToothJpaRepository.saveAndFlush(tooth);
        saveHistory(
                savedTooth,
                replacedTooth == null ? "TOOTH_ADDED" : "TOOTH_REPLACED",
                replacedTooth == null ? List.of(ToothFinding.NOT_ASSESSED) : replacedTooth.getFindings(),
                savedTooth.getFindings(),
                replacedTooth == null ? null : replacedTooth.getMobilityGrade(),
                savedTooth.getMobilityGrade(),
                replacedTooth,
                updatedBy,
                replacedTooth == null
                        ? "Added %s tooth %d.".formatted(
                                typeLabel(savedTooth.getToothType()),
                                savedTooth.getToothNumber())
                        : "Replaced %s tooth %d with %s tooth %d.".formatted(
                                typeLabel(replacedTooth.getToothType()),
                                replacedTooth.getToothNumber(),
                                typeLabel(savedTooth.getToothType()),
                                savedTooth.getToothNumber()),
                savedTooth.getNotes());
        return patientToothMapper.toResponse(savedTooth);
    }

    @Override
    public PatientToothResponse updatePatientTooth(
            UUID patientId,
            UUID toothId,
            UpdatePatientToothRequest request) {
        var tooth = patientToothJpaRepository.findByIdAndPatientIdAndCurrentTrue(toothId, patientId)
                .orElseThrow(() -> new BaseException(
                        HttpStatus.NOT_FOUND.value(),
                        ErrorCode.PATIENT_TOOTH_NOT_FOUND));
        var oldFindings = List.copyOf(tooth.getFindings());
        var oldMobilityGrade = tooth.getMobilityGrade();
        var oldNotes = tooth.getNotes();
        patientToothMapper.updatePatientTooth(request, tooth);
        if (request.getFindings() != null) {
            tooth.setFindings(normalizeFindings(tooth.getFindings()));
        }
        tooth.setMobilityGrade(request.getMobilityGrade());
        validateMobilityGrade(tooth.getMobilityGrade());
        validateMobilityCompatibleWithFindings(tooth.getFindings(), tooth.getMobilityGrade());
        var updatedBy = authenticatedUserProvider.requireUserDetails().getId();
        tooth.setUpdatedBy(updatedBy);
        var savedTooth = patientToothJpaRepository.saveAndFlush(tooth);
        var changes = new ArrayList<String>();
        if (!oldFindings.equals(savedTooth.getFindings())) {
            changes.add("Findings changed from %s to %s."
                    .formatted(labelFindings(oldFindings), labelFindings(savedTooth.getFindings())));
        }
        if (!Objects.equals(oldMobilityGrade, savedTooth.getMobilityGrade())) {
            changes.add("Mobility changed from %s to %s."
                    .formatted(mobilityLabel(oldMobilityGrade), mobilityLabel(savedTooth.getMobilityGrade())));
        }
        if (!Objects.equals(oldNotes, savedTooth.getNotes())) {
            changes.add("Notes updated.");
        }
        if (!changes.isEmpty()) {
            saveHistory(
                    savedTooth,
                    "TOOTH_UPDATED",
                    oldFindings,
                    savedTooth.getFindings(),
                    oldMobilityGrade,
                    savedTooth.getMobilityGrade(),
                    null,
                    updatedBy,
                    String.join(" ", changes),
                    savedTooth.getNotes());
        }
        return patientToothMapper.toResponse(savedTooth);
    }

    private void saveHistory(
            PatientTooth tooth,
            String eventType,
            List<ToothFinding> oldFindings,
            List<ToothFinding> newFindings,
            Integer oldMobilityGrade,
            Integer newMobilityGrade,
            PatientTooth previousTooth,
            UUID changedBy,
            String description,
            String notes) {
        var history = new ToothHistory();
        history.setPatientToothId(tooth.getId());
        history.setOldFindings(oldFindings);
        history.setNewFindings(newFindings);
        history.setOldMobilityGrade(oldMobilityGrade);
        history.setNewMobilityGrade(newMobilityGrade);
        history.setEventType(eventType);
        history.setOldToothType(previousTooth == null ? tooth.getToothType() : previousTooth.getToothType());
        history.setNewToothType(tooth.getToothType());
        history.setOldToothNumber(previousTooth == null ? tooth.getToothNumber() : previousTooth.getToothNumber());
        history.setNewToothNumber(tooth.getToothNumber());
        history.setChangedBy(changedBy);
        history.setDescription(description);
        history.setNotes(notes);
        toothHistoryJpaRepository.save(history);
    }

    private PatientToothHistoryResponse toHistoryResponse(ToothHistory history) {
        return new PatientToothHistoryResponse()
                .historyId(history.getId())
                .patientToothId(history.getPatientToothId())
                .toothNumber(history.getNewToothNumber())
                .toothType(valueOf(history.getNewToothType().name()))
                .previousToothNumber(history.getOldToothNumber())
                .previousToothType(history.getOldToothType() == null
                        ? null
                        : valueOf(history.getOldToothType().name()))
                .eventType(history.getEventType())
                .oldFindings(history.getOldFindings().stream()
                        .map(finding -> com.monadent.contracts.teeth.ToothFinding.valueOf(finding.name()))
                        .toList())
                .newFindings(history.getNewFindings().stream()
                        .map(finding -> com.monadent.contracts.teeth.ToothFinding.valueOf(finding.name()))
                        .toList())
                .oldMobilityGrade(history.getOldMobilityGrade())
                .newMobilityGrade(history.getNewMobilityGrade())
                .description(history.getDescription())
                .notes(history.getNotes())
                .changedBy(history.getChangedBy())
                .changedAt(history.getChangedAt());
    }

    private List<ToothFinding> normalizeFindings(List<ToothFinding> rawFindings) {
        var findings = rawFindings == null || rawFindings.isEmpty()
                ? new ArrayList<>(List.of(ToothFinding.NOT_ASSESSED))
                : new ArrayList<>(rawFindings.stream().distinct().toList());
        boolean absent = findings.contains(ToothFinding.MISSING);
        boolean hasNaturalToothDisease = findings.stream().anyMatch(finding -> switch (finding) {
            case CARIES, PULPITIS, PERIODONTITIS, PERIODONTAL_DISEASE, ROOT_PROBLEM -> true;
            default -> false;
        });
        if ((findings.contains(ToothFinding.NOT_ASSESSED) && findings.size() > 1)
                || (absent && findings.size() > 1)
                || (findings.contains(ToothFinding.HEALTHY) && hasNaturalToothDisease)
                || (findings.contains(ToothFinding.IMPLANT)
                        && (hasNaturalToothDisease || findings.contains(ToothFinding.FILLING)
                                || findings.contains(ToothFinding.CROWN)))) {
            throw new BaseException(HttpStatus.BAD_REQUEST.value(), ErrorCode.INVALID_TOOTH_FINDINGS);
        }
        findings.sort(ToothFinding::compareTo);
        return findings;
    }

    private void validateMobilityCompatibleWithFindings(List<ToothFinding> findings, Integer grade) {
        if (grade != null && findings.contains(ToothFinding.MISSING)) {
            throw new BaseException(HttpStatus.BAD_REQUEST.value(), ErrorCode.INVALID_TOOTH_FINDINGS);
        }
    }

    private void validateMobilityGrade(Integer grade) {
        if (grade != null && (grade < 1 || grade > 3)) {
            throw new BaseException(HttpStatus.BAD_REQUEST.value(), ErrorCode.INVALID_TOOTH_FINDINGS);
        }
    }

    private String labelFindings(List<ToothFinding> findings) {
        return findings.stream().map(Enum::name).toList().toString();
    }

    private String mobilityLabel(Integer grade) {
        return grade == null ? "none" : "grade %d".formatted(grade);
    }

    private String typeLabel(ToothType toothType) {
        return toothType == ToothType.PRIMARY ? "temporary" : "permanent";
    }

    private void ensurePatientExists(UUID patientId) {
        if (!patientJpaRepository.existsById(patientId)) {
            throw new BaseException(
                    HttpStatus.NOT_FOUND.value(),
                    ErrorCode.PATIENT_NOT_FOUND);
        }
    }

    private void validateToothNumberAndType(int toothNumber, ToothType toothType) {
        int quadrant = toothNumber / 10;
        int position = toothNumber % 10;
        boolean validPrimary = quadrant >= 5 && quadrant <= 8 && position >= 1 && position <= 5;
        boolean validPermanent = quadrant >= 1 && quadrant <= 4 && position >= 1 && position <= 8;
        if (toothType == null
                || (toothType == ToothType.PRIMARY && !validPrimary)
                || (toothType == ToothType.PERMANENT && !validPermanent)) {
            throw new BaseException(
                    HttpStatus.BAD_REQUEST.value(),
                    ErrorCode.INVALID_TOOTH_NUMBER);
        }
    }

    private boolean samePosition(int firstToothNumber, int secondToothNumber) {
        int firstQuadrant = firstToothNumber / 10;
        int secondQuadrant = secondToothNumber / 10;
        int firstPosition = firstToothNumber % 10;
        int secondPosition = secondToothNumber % 10;

        int firstPermanentQuadrant = firstQuadrant >= 5 ? firstQuadrant - 4 : firstQuadrant;
        int secondPermanentQuadrant = secondQuadrant >= 5 ? secondQuadrant - 4 : secondQuadrant;

        return firstPermanentQuadrant == secondPermanentQuadrant
                && firstPosition == secondPosition;
    }
}
