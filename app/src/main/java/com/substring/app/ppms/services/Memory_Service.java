package com.substring.app.ppms.services;

import com.substring.app.ppms.entity.Memory_Entity;
import com.substring.app.ppms.repository.Memory_Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class Memory_Service {

    private final Memory_Repository repository;

    public List<Memory_Entity> getAll() {
        return repository.findAll();
    }

    public Memory_Entity save(Memory_Entity obj) {
        return repository.save(obj);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}