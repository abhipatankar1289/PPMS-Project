package com.substring.app.ppms.services;

import com.substring.app.ppms.entity.Currency_Entity;
import com.substring.app.ppms.repository.Currency_Repository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class Currency_Service {

    private final Currency_Repository repository;

    public List<Currency_Entity> getAll() {
        return repository.findAll();
    }

    public Currency_Entity save(Currency_Entity obj) {
        return repository.save(obj);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}