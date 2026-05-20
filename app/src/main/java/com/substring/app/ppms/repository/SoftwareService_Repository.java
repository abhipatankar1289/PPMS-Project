package com.substring.app.ppms.repository;

import com.substring.app.ppms.entity.SoftwareServices_Entity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SoftwareService_Repository extends JpaRepository<SoftwareServices_Entity, Long> {
}