package com.substring.app.ppms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "secondary_interconnect")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SecondaryInterconnect_Entity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String component_category;
    private String vendor;
    private String product_name;
    private String technology;
    private String port_speed_gbps;
    private Integer number_of_ports;
    private String typical_use;
    private Double price;
}