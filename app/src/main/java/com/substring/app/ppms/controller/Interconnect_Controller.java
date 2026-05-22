// ===================== Interconnect_Controller.java =====================
package com.substring.app.ppms.controller;

import com.substring.app.ppms.entity.Interconnect_Entity;
import com.substring.app.ppms.services.Interconnect_Service;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/interconnect")
@RequiredArgsConstructor
public class Interconnect_Controller {

    private final Interconnect_Service service;

    @GetMapping
    public List<Interconnect_Entity> getAll() { return service.getAll(); }

    @PostMapping
    public Interconnect_Entity add(@RequestBody Interconnect_Entity obj) { return service.save(obj); }

    @PutMapping("/{id}")
    public Interconnect_Entity update(@PathVariable Long id, @RequestBody Interconnect_Entity obj) {
        obj.setId(id);
        return service.save(obj);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}