package com.substring.app.ppms.services;

import com.substring.app.ppms.entity.GPU_Entity;
import com.substring.app.ppms.repository.GPU_Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GPU_Service {

    private final GPU_Repository repository;

    public List<GPU_Entity> getAll() {
        return repository.findAll();
    }

    public GPU_Entity save(GPU_Entity obj) {
        return repository.save(obj);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}