package com.deepfake.sentinel.repository;

import com.deepfake.sentinel.entity.AnalysisRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalysisRecordRepository extends JpaRepository<AnalysisRecord, Long> {

    List<AnalysisRecord> findAllByOrderByCreatedAtDesc();

    Page<AnalysisRecord> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<AnalysisRecord> findByUserIdOrderByCreatedAtDesc(Long userId);

    Page<AnalysisRecord> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    long countByVerdict(String verdict);

    long countByMediaType(String mediaType);

    @Query("SELECT AVG(a.confidenceScore) FROM AnalysisRecord a")
    Double getAverageConfidenceScore();

    @Query("SELECT AVG(a.fakeProbability) FROM AnalysisRecord a")
    Double getAverageFakeProbability();

    @Query("SELECT a.verdict, COUNT(a) FROM AnalysisRecord a GROUP BY a.verdict")
    List<Object[]> countGroupedByVerdict();

    @Query("SELECT a.mediaType, COUNT(a) FROM AnalysisRecord a GROUP BY a.mediaType")
    List<Object[]> countGroupedByMediaType();
}
