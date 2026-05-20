package com.substring.app.ppms.services;

import com.substring.app.ppms.entity.SecondaryInterconnect_Entity;
import com.substring.app.ppms.repository.SecondaryInterconnect_Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SecondaryInterconnect_Service {

    private final SecondaryInterconnect_Repository repository;

    public List<SecondaryInterconnect_Entity> getAll() {
        return repository.findAll();
    }

    public SecondaryInterconnect_Entity save(SecondaryInterconnect_Entity obj) {
        return repository.save(obj);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}