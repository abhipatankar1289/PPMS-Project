package com.substring.app.ppms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "service_master")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SoftwareServices_Entity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "service_name")
    private String service_name;

    @Column(name = "Unit")
    private String Unit;

//    private String unit;

    @Column(name = "price")
    private Double price;
}