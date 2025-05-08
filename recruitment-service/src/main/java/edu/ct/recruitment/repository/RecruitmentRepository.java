package edu.ct.recruitment.repository;

import edu.ct.recruitment.entity.Recruitment;
import org.springframework.data.repository.CrudRepository;

public interface RecruitmentRepository extends CrudRepository<Recruitment, Integer> {
}
