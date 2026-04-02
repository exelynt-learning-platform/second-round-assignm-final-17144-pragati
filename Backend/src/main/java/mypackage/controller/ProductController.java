package mypackage.controller;

import jakarta.validation.Valid;
import mypackage.dto.ApiResponse;
import mypackage.dto.ProductRequest;
import mypackage.entity.Product;
import mypackage.services.ProductServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.PUT,RequestMethod.DELETE},allowedHeaders = "*")
public class ProductController {

    @Autowired
    ProductServices productServices;

    @PostMapping
    public ResponseEntity<ApiResponse> AddProduct(
            @RequestParam("product_name") String product_name,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam("stock_quantity") int stock_quantity,
            @RequestParam("category") String category,
            @RequestParam(value = "product_image", required = false) MultipartFile image
    ) {
        ProductRequest request = new ProductRequest(product_name, description, price, stock_quantity, category);
        Product product = productServices.AddProduct(request, image);
        return ResponseEntity.ok(new ApiResponse(true, "Product added successfully.", product));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ApiResponse> UpdateProduct(
            @PathVariable int productId,
            @RequestParam("product_name") String product_name,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam("stock_quantity") int stock_quantity,
            @RequestParam("category") String category,
            @RequestParam(value = "product_image", required = false) MultipartFile image
    ) {
        ProductRequest request = new ProductRequest(product_name, description, price, stock_quantity, category);
        Product product = productServices.UpdateProduct(productId, request, image);
        return ResponseEntity.ok(new ApiResponse(true, "Product updated successfully.", product));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse> DeleteProduct(@PathVariable int productId) {
        productServices.DeleteProduct(productId);
        return ResponseEntity.ok(new ApiResponse(true, "Product deleted successfully.", null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> GetAllProducts() {
        List<Product> products = productServices.GetAllProducts();
        return ResponseEntity.ok(new ApiResponse(true, "Products fetched successfully.", products));
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ApiResponse> GetProductById(@PathVariable int productId) {
        Product product = productServices.GetProductById(productId);
        return ResponseEntity.ok(new ApiResponse(true, "Product fetched successfully.", product));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse> GetByCategory(@PathVariable String category) {
        List<Product> products = productServices.GetProductsByCategory(category);
        return ResponseEntity.ok(new ApiResponse(true, "Products fetched by category.", products));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> SearchProducts(@RequestParam("name") String name) {
        List<Product> products = productServices.SearchProducts(name);
        return ResponseEntity.ok(new ApiResponse(true, "Search results.", products));
    }

    @GetMapping("/image/{imgName}")
    public ResponseEntity<UrlResource> GetProductImage(@PathVariable String imgName) {
        String folderPath = System.getProperty("user.dir") + "/uploads";
        try {
            java.nio.file.Path imgPath = Paths.get(folderPath).resolve(imgName);
            UrlResource resource = new UrlResource(imgPath.toUri());
            if (resource.exists()) {
                MediaType mediaType = org.springframework.http.MediaTypeFactory.getMediaType(resource)
                        .orElse(MediaType.APPLICATION_OCTET_STREAM);
                return ResponseEntity.ok().contentType(mediaType).body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
