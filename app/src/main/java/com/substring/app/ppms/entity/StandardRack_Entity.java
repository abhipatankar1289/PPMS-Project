package com.substring.app.ppms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "standard_rack")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StandardRack_Entity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String component_category;
    private String name;
    private Double price;
}
