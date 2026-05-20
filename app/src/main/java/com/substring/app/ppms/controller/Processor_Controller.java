package com.substring.app.ppms.controller;

import com.substring.app.ppms.entity.Processor_Entity;
import com.substring.app.ppms.services.Processor_Service;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/processor")
@RequiredArgsConstructor
public class Processor_Controller {

    private final Processor_Service service;

    @GetMapping
    public List<Processor_Entity> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Processor_Entity add(@RequestBody Processor_Entity obj) {
        return service.save(obj);
    }

    @PutMapping("/{id}")
    public Processor_Entity update(
            @PathVariable Long id,
            @RequestBody Processor_Entity obj
    ) {
        obj.setId(id);
        return service.save(obj);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}