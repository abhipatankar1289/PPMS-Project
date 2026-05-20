package com.substring.app.ppms.repository;

import com.substring.app.ppms.entity.Workshop_Entity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface Workshop_Repository
        extends JpaRepository<Workshop_Entity, Long> {
}