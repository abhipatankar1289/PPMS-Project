package com.substring.app.ppms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "kvm_switch")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KvmSwitch_Entity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "specification")
    private String specification;


    @Column(name = "ports")
    private Integer ports;

    @Column(name = "form_factor")
    private String formFactor;



    @Column(name = "price")
    private Double price;
}