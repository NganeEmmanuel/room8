package com.room8.contactservice.service;

import com.room8.contactservice.exception.EmailSendingException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    @Captor
    private ArgumentCaptor<MimeMessage> mimeMessageCaptor;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void sendHtmlEmail_shouldSendEmailSuccessfully() throws Exception {
        // Arrange
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        String to = "test@example.com";
        String subject = "Test Subject";
        String htmlContent = "<h1>Hello</h1>";

        // Act
        emailService.sendHtmlEmail(to, subject, htmlContent);

        // Assert
        verify(mailSender).send(mimeMessage);
        // You could go further by capturing MimeMessage and inspecting if needed
    }

    @Test
    void sendHtmlEmail_shouldThrowEmailSendingException_whenMessagingExceptionOccurs() throws Exception {
        // Arrange
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        // Make MimeMessageHelper throw MessagingException
        doThrow(new RuntimeException("Test exception")).when(mailSender).send(any(MimeMessage.class));

        // Act & Assert
        Exception exception = assertThrows(
                Exception.class,
                () -> emailService.sendHtmlEmail("fail@example.com", "Fail", "<p>fail</p>")
        );

        assertEquals("Failed to send email", exception.getMessage());
        assertInstanceOf(Exception.class, exception.getCause());
    }
}
