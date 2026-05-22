package com.substring.app.ppms.controller;

import com.substring.app.ppms.entity.ManagementNetwork_Entity;
import com.substring.app.ppms.services.ManagementNetwork_Service;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/management-network")
@RequiredArgsConstructor
public class ManagementNetwork_Controller {

    private final ManagementNetwork_Service service;

    @GetMapping
    public List<ManagementNetwork_Entity> getAll() { return service.getAll(); }

    @PostMapping
    public ManagementNetwork_Entity add(@RequestBody ManagementNetwork_Entity obj) { return service.save(obj); }

    @PutMapping("/{id}")
    public ManagementNetwork_Entity update(@PathVariable Long id, @RequestBody ManagementNetwork_Entity obj) {
        obj.setId(id);
        return service.save(obj);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}
