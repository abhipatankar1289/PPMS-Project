package com.substring.app.ppms.services;

import com.substring.app.ppms.entity.Processor_Entity;
import com.substring.app.ppms.repository.Processor_Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class Processor_Service {

    private final Processor_Repository repository;

    public List<Processor_Entity> getAll() {
        return repository.findAll();
    }

    public Processor_Entity save(Processor_Entity obj) {
        return repository.save(obj);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}