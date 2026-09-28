package com.deepfake.sentinel.repository;

import com.deepfake.sentinel.entity.ThreatMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ThreatMetricRepository extends JpaRepository<ThreatMetric, Long> {
    Optional<ThreatMetric> findByMetricDate(LocalDate metricDate);
    List<ThreatMetric> findTop30ByOrderByMetricDateDesc();
}
