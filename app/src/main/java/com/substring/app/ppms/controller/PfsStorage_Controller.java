package com.substring.app.ppms.controller;

import com.substring.app.ppms.entity.PfsStorage_Entity;
import com.substring.app.ppms.services.PfsStorage_Service;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pfs")
@RequiredArgsConstructor
public class PfsStorage_Controller {

    private final PfsStorage_Service service;

    @GetMapping
    public List<PfsStorage_Entity> getAll() {
        return service.getAll();
    }

    @PostMapping
    public PfsStorage_Entity add(@RequestBody PfsStorage_Entity obj) {
        return service.save(obj);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}