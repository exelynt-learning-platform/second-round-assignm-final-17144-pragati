package mypackage.services;

import mypackage.dto.ProductRequest;
import mypackage.entity.Product;
import mypackage.exception.ResourceNotFoundException;
import mypackage.repository.IProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.util.List;

@Service
public class ProductServices {

    @Autowired
    private IProductRepository iProductRepository;

    public Product AddProduct(ProductRequest request, MultipartFile image) {
        Product product = new Product();
        product.setProduct_name(request.getProduct_name());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock_quantity(request.getStock_quantity());
        product.setCategory(request.getCategory());

        if (image != null && !image.isEmpty()) {
            String imgName = SaveImage(image);
            product.setProduct_image(imgName);
        }

        return iProductRepository.save(product);
    }

    public Product UpdateProduct(int productId, ProductRequest request, MultipartFile image) {
        Product product = iProductRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));

        product.setProduct_name(request.getProduct_name());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock_quantity(request.getStock_quantity());
        product.setCategory(request.getCategory());

        if (image != null && !image.isEmpty()) {
            String imgName = SaveImage(image);
            product.setProduct_image(imgName);
        }

        return iProductRepository.save(product);
    }

    public void DeleteProduct(int productId) {
        Product product = iProductRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
        iProductRepository.delete(product);
    }

    public List<Product> GetAllProducts() {
        return iProductRepository.findAll();
    }

    public Product GetProductById(int productId) {
        return iProductRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
    }

    public List<Product> GetProductsByCategory(String category) {
        return iProductRepository.findByCategory(category);
    }

    public List<Product> SearchProducts(String name) {
        return iProductRepository.findByProductNameContaining(name);
    }

    private String SaveImage(MultipartFile image) {
        try {
            String uploadDir = System.getProperty("user.dir") + "/uploads";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String imgName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            String imgPath = uploadDir + File.separator + imgName;

            try (FileOutputStream fout = new FileOutputStream(imgPath)) {
                fout.write(image.getBytes());
            }
            return imgName;
        } catch (Exception e) {
            System.out.println("Error saving image: " + e.getMessage());
            throw new RuntimeException("Failed to save product image.");
        }
    }
}
