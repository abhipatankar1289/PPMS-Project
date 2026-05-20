package com.substring.app.ppms.repository;

import com.substring.app.ppms.entity.Memory_Entity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface Memory_Repository extends JpaRepository<Memory_Entity, Long> {
}