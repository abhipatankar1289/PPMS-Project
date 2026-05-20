package com.substring.app.ppms.services;

import com.substring.app.ppms.entity.OcpRack_Entity;
import com.substring.app.ppms.repository.OcpRack_Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OcpRack_Service {

    private final OcpRack_Repository repository;

    public List<OcpRack_Entity> getAll() {
        return repository.findAll();
    }

    public OcpRack_Entity save(OcpRack_Entity obj) {
        return repository.save(obj);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}