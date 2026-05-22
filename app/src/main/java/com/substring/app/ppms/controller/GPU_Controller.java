package com.substring.app.ppms.controller;

import com.substring.app.ppms.entity.GPU_Entity;
import com.substring.app.ppms.services.GPU_Service;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gpu")
@RequiredArgsConstructor
public class GPU_Controller {

    private final GPU_Service service;

    @GetMapping
    public List<GPU_Entity> getAll() {
        return service.getAll();
    }

    @PostMapping
    public GPU_Entity add(@RequestBody GPU_Entity obj) {
        System.out.println("FULL OBJECT = " + obj);
        System.out.println("CATEGORY = " + obj.getComponentCategory());
        return service.save(obj);
    }

    @PutMapping("/{id}")
    public GPU_Entity update(
            @PathVariable Long id,
            @RequestBody GPU_Entity obj
    ) {
        obj.setId(id);
        return service.save(obj);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}