package com.placement.management.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a recruiting company in the placement system.
 *
 * @author Team — feature/company-drive & feature/application-interview
 */
@Entity
@Table(name = "companies", uniqueConstraints = {
        @UniqueConstraint(columnNames = "name", name = "uk_company_name")
})
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 100)
    private String industry;

    @Column(length = 255)
    private String website;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(length = 150)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(length = 300)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 100)
    private String country;

    private String location;
    private String hrContactEmail;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Company() {}

    public Company(Long id, String companyName, String industry, String website, String location, String hrContactEmail) {
        this.id = id;
        this.name = companyName;
        this.industry = industry;
        this.website = website;
        this.location = location;
        this.hrContactEmail = hrContactEmail;
        this.email = hrContactEmail;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (this.name == null && this.email != null) {
            this.name = this.email;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCompanyName() { return name != null ? name : email; }
    public void setCompanyName(String companyName) { this.name = companyName; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getLocation() { return location != null ? location : city; }
    public void setLocation(String location) { this.location = location; }

    public String getHrContactEmail() { return hrContactEmail != null ? hrContactEmail : email; }
    public void setHrContactEmail(String hrContactEmail) { this.hrContactEmail = hrContactEmail; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
