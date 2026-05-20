package com.substring.app.ppms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "pfs_storage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PfsStorage_Entity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;          // Lustre 1PB etc
    private String total_capacity_pb;
    private String manufacturer;
    private String software_model;
    private Double price;
}