package com.monadent.infrastructure.persistence;

import com.monadent.domain.models.entity.IpAddressEntry;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface IpAddressEntryJpaRepository extends JpaRepository<IpAddressEntry, UUID> {

    boolean existsByAddress(String address);

    List<IpAddressEntry> findAllByOrderByNameAsc();

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select entry from IpAddressEntry entry")
    List<IpAddressEntry> findAllForUpdate();
}
