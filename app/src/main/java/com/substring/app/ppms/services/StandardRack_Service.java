package com.substring.app.ppms.services;

import com.substring.app.ppms.entity.StandardRack_Entity;
import com.substring.app.ppms.repository.StandardRack_Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StandardRack_Service {

    private final StandardRack_Repository repository;

    public List<StandardRack_Entity> getAll() {
        return repository.findAll();
    }

    public StandardRack_Entity save(StandardRack_Entity obj) {
        return repository.save(obj);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}