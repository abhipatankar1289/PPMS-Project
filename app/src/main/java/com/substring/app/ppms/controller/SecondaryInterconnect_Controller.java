package com.substring.app.ppms.controller;

import com.substring.app.ppms.entity.SecondaryInterconnect_Entity;
import com.substring.app.ppms.services.SecondaryInterconnect_Service;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/secondary-interconnect")
@RequiredArgsConstructor
public class SecondaryInterconnect_Controller {

    private final SecondaryInterconnect_Service service;

    @GetMapping
    public List<SecondaryInterconnect_Entity> getAll() { return service.getAll(); }

    @PostMapping
    public SecondaryInterconnect_Entity add(@RequestBody SecondaryInterconnect_Entity obj) { return service.save(obj); }

    @PutMapping("/{id}")
    public SecondaryInterconnect_Entity update(@PathVariable Long id, @RequestBody SecondaryInterconnect_Entity obj) {
        obj.setId(id);
        return service.save(obj);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}
