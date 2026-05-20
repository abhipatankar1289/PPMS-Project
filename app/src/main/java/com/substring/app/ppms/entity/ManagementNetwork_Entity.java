package com.substring.app.ppms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "management_network")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ManagementNetwork_Entity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String component_category;

    private String vendor;

    private String technology;
    private String product_name;
    private String port_speed_gbps;
    private Integer number_of_ports;
    @Column(name = "usage_type")
    private String use;
    private Double price;
}
