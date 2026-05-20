package com.substring.app.ppms.services;

import com.substring.app.ppms.entity.SoftwareServices_Entity;
import com.substring.app.ppms.repository.SoftwareService_Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SoftwareService_Service {

    private final SoftwareService_Repository repository;

    public List<SoftwareServices_Entity> getAll() {
        return repository.findAll();
    }

    public SoftwareServices_Entity save(SoftwareServices_Entity obj) {
        return repository.save(obj);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}