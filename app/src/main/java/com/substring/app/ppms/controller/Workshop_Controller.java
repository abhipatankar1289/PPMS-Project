package com.substring.app.ppms.controller;

import com.substring.app.ppms.entity.Workshop_Entity;
import com.substring.app.ppms.services.Workshop_Service;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addon_service")
@RequiredArgsConstructor
public class Workshop_Controller {

    private final Workshop_Service service;

    @GetMapping
    public List<Workshop_Entity> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Workshop_Entity add(@RequestBody Workshop_Entity serviceObj) {
        return service.save(serviceObj);
    }

    @PutMapping("/{id}")
    public Workshop_Entity update(@PathVariable Long id, @RequestBody Workshop_Entity obj) {
        obj.setId(id);
        return service.save(obj);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}