package com.substring.app.ppms.controller;

import com.substring.app.ppms.entity.SoftwareServices_Entity;
import com.substring.app.ppms.services.SoftwareService_Service;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/software-service")
@RequiredArgsConstructor
public class SoftwareService_Controller {

    private final SoftwareService_Service service;

    @GetMapping
    public List<SoftwareServices_Entity> getAll() {
        return service.getAll();
    }

    @PostMapping
    public SoftwareServices_Entity add(@RequestBody SoftwareServices_Entity obj) {
        return service.save(obj);
    }

    @PutMapping("/{id}")
    public SoftwareServices_Entity update(@PathVariable Long id, @RequestBody SoftwareServices_Entity obj) {
        obj.setId(id);
        return service.save(obj);  // JPA save() does upsert
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}