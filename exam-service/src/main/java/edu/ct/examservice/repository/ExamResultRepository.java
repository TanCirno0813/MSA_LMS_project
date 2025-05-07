package edu.ct.examservice.repository;

import edu.ct.examservice.entity.ExamResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ExamResultRepository extends JpaRepository<ExamResult, Long> {
    @Query("SELECT er FROM ExamResult er ORDER BY er.submittedAt DESC")
    List<ExamResult> findLatestResults();
<<<<<<< HEAD

=======
    
>>>>>>> f940107112cd48c47d979a53cdde8052e2798a9b
    List<ExamResult> findByUserId(Long userId);
}
