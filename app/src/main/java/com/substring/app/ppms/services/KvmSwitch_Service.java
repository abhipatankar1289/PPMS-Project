package com.substring.app.ppms.services;

import com.substring.app.ppms.entity.KvmSwitch_Entity;
import com.substring.app.ppms.repository.KvmSwitch_Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KvmSwitch_Service {

    private final KvmSwitch_Repository repository;

    public List<KvmSwitch_Entity> getAll() {
        return repository.findAll();
    }

    public KvmSwitch_Entity save(KvmSwitch_Entity obj) {
        return repository.save(obj);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}