package com.substring.app.ppms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "interconnect")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Interconnect_Entity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String component_category;
    private String vendor;
    private String product_name;
    private String technology;
    private String port_speed_gbps;
    private String aggregate_bandwidth_tbps;
    private String latency_ns;
    private Integer number_of_ports;
    private Double price;
}