package com.substring.app.ppms.controller;

import com.substring.app.ppms.entity.Currency_Entity;
import com.substring.app.ppms.services.Currency_Service;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/currency")
@RequiredArgsConstructor
public class Currency_Controller {

    private final Currency_Service service;

    @GetMapping
    public List<Currency_Entity> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Currency_Entity add(@RequestBody Currency_Entity obj) {
        return service.save(obj);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}