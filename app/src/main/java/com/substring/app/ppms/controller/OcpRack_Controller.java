package com.substring.app.ppms.controller;

import com.substring.app.ppms.entity.OcpRack_Entity;
import com.substring.app.ppms.services.OcpRack_Service;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ocp-rack")
@RequiredArgsConstructor
public class OcpRack_Controller {

    private final OcpRack_Service service;

    @GetMapping
    public List<OcpRack_Entity> getAll() { return service.getAll(); }

    @PostMapping
    public OcpRack_Entity add(@RequestBody OcpRack_Entity obj) { return service.save(obj); }

    @PutMapping("/{id}")
    public OcpRack_Entity update(@PathVariable Long id, @RequestBody OcpRack_Entity obj) {
        obj.setId(id);
        return service.save(obj);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}