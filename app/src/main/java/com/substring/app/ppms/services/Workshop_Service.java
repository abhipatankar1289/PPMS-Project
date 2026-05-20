package com.substring.app.ppms.services;

import com.substring.app.ppms.entity.Workshop_Entity;
import com.substring.app.ppms.repository.Workshop_Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class Workshop_Service {

    private final Workshop_Repository repository;

    public List<Workshop_Entity> getAll() {
        return repository.findAll();
    }

    public Workshop_Entity save(Workshop_Entity service) {
        return repository.save(service);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}