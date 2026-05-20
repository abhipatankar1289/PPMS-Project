package com.substring.app.ppms.services;

import com.substring.app.ppms.entity.Interconnect_Entity;
import com.substring.app.ppms.repository.Interconnect_Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class Interconnect_Service {

    private final Interconnect_Repository repository;

    public List<Interconnect_Entity> getAll() {
        return repository.findAll();
    }

    public Interconnect_Entity save(Interconnect_Entity obj) {
        return repository.save(obj);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}