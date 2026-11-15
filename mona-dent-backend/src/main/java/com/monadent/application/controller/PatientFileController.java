package com.monadent.application.controller;

import com.monadent.application.security.AuthenticatedUserProvider;
import com.monadent.domain.models.entity.PatientFile;
import com.monadent.domain.models.security.CustomUserDetails;
import com.monadent.infrastructure.persistence.PatientFileJpaRepository;
import com.monadent.infrastructure.persistence.PatientJpaRepository;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.CacheControl;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.ByteArrayOutputStream;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import javax.imageio.ImageIO;

@RestController
@RequiredArgsConstructor
@RequestMapping("/patients/{patientId}/files")
public class PatientFileController {
    private final PatientFileJpaRepository fileRepository;
    private final PatientJpaRepository patientRepository;
    private final AuthenticatedUserProvider authenticatedUserProvider;

    @Value("${app.files.directory:${user.home}/.mona-dent/files}")
    private String filesDirectory;

    @GetMapping
    public List<PatientFileResponse> list(@PathVariable UUID patientId) {
        requirePatient(patientId);
        return fileRepository.findAllByPatientIdOrderByUploadedAtDesc(patientId)
                .stream().map(PatientFileResponse::from).toList();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Transactional
    public ResponseEntity<PatientFileResponse> upload(
            @PathVariable UUID patientId,
            @RequestPart("file") @NotNull MultipartFile file) throws IOException {
        requirePatient(patientId);
        if (file.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The file is empty.");

        String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null
                ? "upload" : file.getOriginalFilename());
        if (originalName.contains("..")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid file name.");
        }
        String extension = StringUtils.getFilenameExtension(originalName);
        extension = extension == null ? "" : extension.toLowerCase(Locale.ROOT);
        if (!(file.getContentType() != null && file.getContentType().toLowerCase(Locale.ROOT).startsWith("image/"))
                && !extension.equals("pdf") && !extension.equals("dcm") && !extension.equals("dicom")) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Unsupported file type.");
        }

        UUID storageId = UUID.randomUUID();
        Path root = Paths.get(filesDirectory).toAbsolutePath().normalize();
        Path patientDirectory = root.resolve(patientId.toString()).normalize();
        Path target = patientDirectory.resolve(storageId + (extension.isEmpty() ? "" : "." + extension)).normalize();
        if (!target.startsWith(root)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        Files.createDirectories(patientDirectory);
        file.transferTo(target);

        CustomUserDetails user = authenticatedUserProvider.requireUserDetails();
        PatientFile record = new PatientFile();
        record.setPatientId(patientId);
        record.setUploadedBy(user.getId());
        record.setFileName(originalName);
        record.setStorageKey(root.relativize(target).toString());
        record.setContentType(file.getContentType() == null ? MediaType.APPLICATION_OCTET_STREAM_VALUE : file.getContentType());
        record.setFileSizeBytes(file.getSize());
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(PatientFileResponse.from(fileRepository.saveAndFlush(record)));
        } catch (RuntimeException error) {
            Files.deleteIfExists(target);
            throw error;
        }
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<Resource> download(@PathVariable UUID patientId, @PathVariable UUID fileId) {
        PatientFile record = findFile(patientId, fileId);
        Path filePath = resolveStorageKey(record.getStorageKey());
        if (!Files.isRegularFile(filePath)) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        Resource resource = new FileSystemResource(filePath);
        return ResponseEntity.ok()
                .contentType(parseMediaType(record.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
                        .filename(record.getFileName()).build().toString())
                .body(resource);
    }

    @GetMapping(value = "/{fileId}/thumbnail", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> thumbnail(@PathVariable UUID patientId, @PathVariable UUID fileId)
            throws IOException {
        PatientFile record = findFile(patientId, fileId);
        if (record.getContentType() == null || !record.getContentType().startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE);
        }
        Path filePath = resolveStorageKey(record.getStorageKey());
        if (!Files.isRegularFile(filePath)) throw new ResponseStatusException(HttpStatus.NOT_FOUND);

        BufferedImage source = ImageIO.read(filePath.toFile());
        if (source == null) throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE);
        double scale = Math.min(1.0, Math.min(320.0 / source.getWidth(), 240.0 / source.getHeight()));
        int width = Math.max(1, (int) Math.round(source.getWidth() * scale));
        int height = Math.max(1, (int) Math.round(source.getHeight() * scale));
        BufferedImage thumbnail = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = thumbnail.createGraphics();
        graphics.setColor(java.awt.Color.WHITE);
        graphics.fillRect(0, 0, width, height);
        graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        graphics.drawImage(source, 0, 0, width, height, null);
        graphics.dispose();

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        ImageIO.write(thumbnail, "jpg", output);
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .contentType(MediaType.IMAGE_JPEG)
                .body(output.toByteArray());
    }

    @DeleteMapping("/{fileId}")
    @Transactional
    public ResponseEntity<Void> delete(@PathVariable UUID patientId, @PathVariable UUID fileId) throws IOException {
        PatientFile record = findFile(patientId, fileId);
        fileRepository.delete(record);
        Files.deleteIfExists(resolveStorageKey(record.getStorageKey()));
        return ResponseEntity.noContent().build();
    }

    private void requirePatient(UUID patientId) {
        if (!patientRepository.existsById(patientId)) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    private PatientFile findFile(UUID patientId, UUID fileId) {
        return fileRepository.findByIdAndPatientId(fileId, patientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    private Path resolveStorageKey(String key) {
        Path root = Paths.get(filesDirectory).toAbsolutePath().normalize();
        Path path = root.resolve(key).normalize();
        if (!path.startsWith(root)) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return path;
    }

    private MediaType parseMediaType(String contentType) {
        try { return MediaType.parseMediaType(contentType); }
        catch (RuntimeException ignored) { return MediaType.APPLICATION_OCTET_STREAM; }
    }

    public record PatientFileResponse(UUID id, String fileName, String contentType, long fileSizeBytes,
                                      java.time.OffsetDateTime uploadedAt) {
        static PatientFileResponse from(PatientFile file) {
            return new PatientFileResponse(file.getId(), file.getFileName(), file.getContentType(),
                    file.getFileSizeBytes(), file.getUploadedAt());
        }
    }
}
