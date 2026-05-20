package com.substring.app.ppms.services;

import com.substring.app.ppms.entity.ManagementNetwork_Entity;
import com.substring.app.ppms.repository.ManagementNetwork_Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ManagementNetwork_Service {

    private final ManagementNetwork_Repository repository;

    public List<ManagementNetwork_Entity> getAll() {
        return repository.findAll();
    }

    public ManagementNetwork_Entity save(ManagementNetwork_Entity obj) {
        return repository.save(obj);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}