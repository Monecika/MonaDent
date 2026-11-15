package com.monadent.domain.service;

import com.monadent.contracts.ipaddresses.CreateIpAddressRequest;
import com.monadent.contracts.ipaddresses.IpAddressResponse;
import com.monadent.contracts.ipaddresses.UpdateIpAddressRequest;
import com.monadent.domain.exception.BaseException;
import com.monadent.domain.exception.ErrorCode;
import com.monadent.domain.models.entity.IpAddressEntry;
import com.monadent.infrastructure.persistence.IpAddressEntryJpaRepository;
import com.monadent.shared.Ipv4AddressValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class IpAddressService {

    private final IpAddressEntryJpaRepository repository;

    @Transactional(readOnly = true)
    public List<IpAddressResponse> getAll() {
        return repository.findAllByOrderByNameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public IpAddressResponse create(CreateIpAddressRequest request) {
        String name = request.getName().trim();
        String address = Ipv4AddressValidator.normalize(request.getAddress());

        if (name.isBlank() || name.length() > 100) {
            throw new IllegalArgumentException("IP address name must contain between 1 and 100 characters.");
        }
        if (address == null) {
            throw new BaseException(HttpStatus.BAD_REQUEST.value(), ErrorCode.INVALID_IP_ADDRESS);
        }
        if (repository.existsByAddress(address)) {
            throw new BaseException(HttpStatus.CONFLICT.value(), ErrorCode.IP_ADDRESS_ALREADY_EXISTS);
        }

        IpAddressEntry entry = new IpAddressEntry();
        entry.setName(name);
        entry.setAddress(address);
        return toResponse(repository.save(entry));
    }

    public IpAddressResponse updateName(UUID id, UpdateIpAddressRequest request) {
        IpAddressEntry entry = repository.findById(id)
                .orElseThrow(() -> new BaseException(HttpStatus.NOT_FOUND.value(), ErrorCode.IP_ADDRESS_NOT_FOUND));
        String name = request.getName().trim();
        if (name.isBlank() || name.length() > 100) {
            throw new IllegalArgumentException("IP address name must contain between 1 and 100 characters.");
        }

        entry.setName(name);
        return toResponse(repository.save(entry));
    }

    public void delete(UUID id) {
        List<IpAddressEntry> entries = repository.findAllForUpdate();
        IpAddressEntry entry = entries.stream()
                .filter(candidate -> candidate.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new BaseException(HttpStatus.NOT_FOUND.value(), ErrorCode.IP_ADDRESS_NOT_FOUND));

        if (entries.size() <= 1) {
            throw new BaseException(HttpStatus.CONFLICT.value(), ErrorCode.LAST_IP_ADDRESS);
        }

        repository.delete(entry);
    }

    @Transactional(readOnly = true)
    public boolean isAllowed(String address) {
        return Ipv4AddressValidator.isValid(address)
                && repository.findAll().stream()
                        .anyMatch(entry -> Ipv4AddressValidator.contains(entry.getAddress(), address));
    }

    @Transactional(readOnly = true)
    public boolean isEmpty() {
        return repository.count() == 0;
    }

    private IpAddressResponse toResponse(IpAddressEntry entry) {
        return new IpAddressResponse(entry.getId(), entry.getName(), entry.getAddress());
    }
}
