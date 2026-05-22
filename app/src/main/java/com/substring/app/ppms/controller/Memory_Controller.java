package com.substring.app.ppms.controller;


import com.substring.app.ppms.entity.Memory_Entity;
import com.substring.app.ppms.services.Memory_Service;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/memory")
@RequiredArgsConstructor
public class Memory_Controller {

    private final Memory_Service service;

    @GetMapping
    public List<Memory_Entity> getAll() { return service.getAll(); }

    @PostMapping
    public Memory_Entity add(@RequestBody Memory_Entity obj) { return service.save(obj); }

    @PutMapping("/{id}")
    public Memory_Entity update(@PathVariable Long id, @RequestBody Memory_Entity obj) {
        obj.setId(id);
        return service.save(obj);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}