package com.Dev_learning_Platform.Dev_learning_Platform.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Dev_learning_Platform.Dev_learning_Platform.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

}
