package com.substring.app.ppms.controller;

import com.substring.app.ppms.entity.StandardRack_Entity;
import com.substring.app.ppms.services.StandardRack_Service;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/standard-rack")
@RequiredArgsConstructor
public class StandardRack_Controller {

    private final StandardRack_Service service;

    @GetMapping
    public List<StandardRack_Entity> getAll() { return service.getAll(); }

    @PostMapping
    public StandardRack_Entity add(@RequestBody StandardRack_Entity obj) { return service.save(obj); }

    @PutMapping("/{id}")
    public StandardRack_Entity update(@PathVariable Long id, @RequestBody StandardRack_Entity obj) {
        obj.setId(id);
        return service.save(obj);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}