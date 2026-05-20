package com.substring.app.ppms.controller;

import com.substring.app.ppms.entity.KvmSwitch_Entity;
import com.substring.app.ppms.services.KvmSwitch_Service;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kvm")
@RequiredArgsConstructor
//@CrossOrigin("*")
public class KvmSwitch_Controller {

    private final KvmSwitch_Service service;

    @GetMapping
    public List<KvmSwitch_Entity> getAll() {
        return service.getAll();
    }

    @PostMapping
    public KvmSwitch_Entity add(@RequestBody KvmSwitch_Entity obj) {
        return service.save(obj);
    }

    /* ================= UPDATE ================= */

    @PutMapping("/{id}")
    public KvmSwitch_Entity update(
            @PathVariable Long id,
            @RequestBody KvmSwitch_Entity obj
    ) {

        obj.setId(id);

        return service.save(obj);
    }

    /* ================= DELETE ================= */

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}