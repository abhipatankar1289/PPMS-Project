package com.substring.app.ppms.services;

import com.substring.app.ppms.entity.PfsStorage_Entity;
import com.substring.app.ppms.repository.PfsStorage_Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PfsStorage_Service {

    private final PfsStorage_Repository repository;

    public List<PfsStorage_Entity> getAll() {
        return repository.findAll();
    }

    public PfsStorage_Entity save(PfsStorage_Entity obj) {
        return repository.save(obj);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}