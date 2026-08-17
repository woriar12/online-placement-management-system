package com.placement.management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String companyName;

    private String industry;

    private String website;

    private String location;

    private String hrContactEmail;

    public Company() {}

    public Company(Long id, String companyName, String industry, String website, String location, String hrContactEmail) {
        this.id = id;
        this.companyName = companyName;
        this.industry = industry;
        this.website = website;
        this.location = location;
        this.hrContactEmail = hrContactEmail;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getHrContactEmail() {
        return hrContactEmail;
    }

    public void setHrContactEmail(String hrContactEmail) {
        this.hrContactEmail = hrContactEmail;
    }
}
