import { zodResolver } from '@hookform/resolvers/zod';
import { CardHeader, Divider, Typography, Box } from '@mui/material';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { _tags } from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { useSearchParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { z as zod } from 'zod';
import { RenderAllPicklist } from '../Picklists/RenderAllPicklist';
import useAddVisualize from './http/useAddVisualize';
import { useGetVisualizeById } from './http/useGetVisualizeById';
import { imgUrl } from 'src/utils/BaseUrls';

// ----------------------------------------------------------------------

type NewPostSchemaType = zod.infer<typeof NewPostSchema>;

const NewPostSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  group: zod.string().min(1, { message: 'Group is required!' }),
  image: schemaHelper.file({ message: { required_error: 'Image is required!' } }),
  dimension_width: zod.coerce.number().min(0, { message: 'Dimension Width is required!' }),
  dimension_height: zod.coerce.number().min(0, { message: 'Dimension Height is required!' }),
  area_x1: zod.coerce.number().min(0, { message: 'Area X1 is required!' }),
  area_y1: zod.coerce.number().min(0, { message: 'Area Y1 is required!' }),
  area_x2: zod.coerce.number().min(0, { message: 'Area X2 is required!' }),
  area_y2: zod.coerce.number().min(0, { message: 'Area Y2 is required!' }),
  tags: zod.string().array().optional(),
});


const ImageRuler = ({ imageUrl, onAreaSelect, currentArea, wallDimensions }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hoveredArea, setHoveredArea] = useState(null);


  const getPixelToCmRatio = useCallback(() => {
    if (!imageLoaded || !wallDimensions?.width || !wallDimensions?.height || !imageRef.current) {
      return { x: 1, y: 1 };
    }

    const img = imageRef.current;
    if (!img.naturalWidth || !img.naturalHeight) {
      return { x: 1, y: 1 };
    }

    const pixelToCmX = wallDimensions.width / img.naturalWidth;
    const pixelToCmY = wallDimensions.height / img.naturalHeight;

    return { x: pixelToCmX, y: pixelToCmY };
  }, [imageLoaded, wallDimensions?.width, wallDimensions?.height]);


  const cmToPixels = useCallback((cmValue, axis = 'x') => {
    if (typeof cmValue !== 'number' || !isFinite(cmValue)) return 0;

    const ratio = getPixelToCmRatio();
    const result = axis === 'x' ? cmValue / ratio.x : cmValue / ratio.y;

    return isFinite(result) ? result : 0;
  }, [getPixelToCmRatio]);


  const pixelsToCm = useCallback((pixelValue, axis = 'x') => {
    if (typeof pixelValue !== 'number' || !isFinite(pixelValue)) return 0;

    const ratio = getPixelToCmRatio();
    const result = axis === 'x' ? pixelValue * ratio.x : pixelValue * ratio.y;

    return isFinite(result) ? result : 0;
  }, [getPixelToCmRatio]);

  useEffect(() => {
    if (!imageUrl || !imageRef.current) return;

    const img = imageRef.current;
    const handleLoad = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        setImageLoaded(true);
        drawCanvas();
      }
    };

    const handleError = () => {
      console.error('Failed to load image:', imageUrl);
      setImageLoaded(false);
    };

    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = imageUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  useEffect(() => {
    if (imageLoaded) {
      drawCanvas();
    }
  }, [currentArea, imageLoaded, wallDimensions]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imageRef.current;

    if (!canvas || !ctx || !img || !imageLoaded || !img.naturalWidth || !img.naturalHeight) {
      return;
    }

    try {

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;


      ctx.clearRect(0, 0, canvas.width, canvas.height);


      drawGrid(ctx, canvas.width, canvas.height);


      if (currentArea &&
        typeof currentArea.x1 === 'number' && typeof currentArea.y1 === 'number' &&
        typeof currentArea.x2 === 'number' && typeof currentArea.y2 === 'number' &&
        isFinite(currentArea.x1) && isFinite(currentArea.y1) &&
        isFinite(currentArea.x2) && isFinite(currentArea.y2)) {


        const x1Px = cmToPixels(currentArea.x1, 'x');
        const y1Px = cmToPixels(currentArea.y1, 'y');
        const x2Px = cmToPixels(currentArea.x2, 'x');
        const y2Px = cmToPixels(currentArea.y2, 'y');


        if (!isFinite(x1Px) || !isFinite(y1Px) || !isFinite(x2Px) || !isFinite(y2Px)) {
          return;
        }


        const availableX = Math.max(0, x1Px);
        const availableY = Math.max(0, y1Px);
        const availableWidth = Math.max(0, canvas.width - x1Px - x2Px);
        const availableHeight = Math.max(0, canvas.height - y1Px - y2Px);


        if (availableWidth <= 0 || availableHeight <= 0) {
          return;
        }


        ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';


        if (y1Px > 0) {
          ctx.fillRect(0, 0, canvas.width, y1Px);
        }


        if (y2Px > 0) {
          ctx.fillRect(0, Math.max(0, canvas.height - y2Px), canvas.width, y2Px);
        }


        if (x1Px > 0) {
          ctx.fillRect(0, y1Px, x1Px, availableHeight);
        }


        if (x2Px > 0) {
          ctx.fillRect(Math.max(0, canvas.width - x2Px), y1Px, x2Px, availableHeight);
        }


        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.setLineDash([]);
        ctx.strokeRect(availableX, availableY, availableWidth, availableHeight);


        ctx.fillStyle = '#00ff00';
        const markerSize = 8;
        const halfMarker = markerSize / 2;

        ctx.fillRect(availableX - halfMarker, availableY - halfMarker, markerSize, markerSize);
        ctx.fillRect(availableX + availableWidth - halfMarker, availableY - halfMarker, markerSize, markerSize);
        ctx.fillRect(availableX - halfMarker, availableY + availableHeight - halfMarker, markerSize, markerSize);
        ctx.fillRect(availableX + availableWidth - halfMarker, availableY + availableHeight - halfMarker, markerSize, markerSize);

        // Draw dimension labels
        drawDimensionLabels(ctx, {
          x1: x1Px, y1: y1Px, x2: x2Px, y2: y2Px,
          availableWidth, availableHeight
        }, currentArea);
      }
    } catch (error) {
      console.error('Error drawing canvas:', error);
    }
  }, [imageLoaded, currentArea, wallDimensions, cmToPixels]);

  const drawGrid = useCallback((ctx, width, height) => {
    if (!ctx || !isFinite(width) || !isFinite(height) || width <= 0 || height <= 0) {
      return;
    }

    try {
      const ratio = getPixelToCmRatio();
      if (!ratio.x || !ratio.y || !isFinite(ratio.x) || !isFinite(ratio.y)) {
        return;
      }

      const gridSpacingCm = 10;
      const gridSpacingPxX = gridSpacingCm / ratio.x;
      const gridSpacingPxY = gridSpacingCm / ratio.y;

      if (!isFinite(gridSpacingPxX) || !isFinite(gridSpacingPxY) || gridSpacingPxX <= 0 || gridSpacingPxY <= 0) {
        return;
      }

      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);

      // Vertical lines
      for (let x = 0; x <= width; x += gridSpacingPxX) {
        if (!isFinite(x)) break;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }


      for (let y = 0; y <= height; y += gridSpacingPxY) {
        if (!isFinite(y)) break;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.restore();
    } catch (error) {
      console.error('Error drawing grid:', error);
    }
  }, [getPixelToCmRatio]);

  const drawDimensionLabels = useCallback((ctx, pixels, cmValues) => {
    if (!ctx || !pixels || !cmValues || !wallDimensions?.width || !wallDimensions?.height) {
      return;
    }

    try {
      ctx.save();
      ctx.fillStyle = '#333';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';


      const availableWidthCm = Math.max(0, wallDimensions.width - cmValues.x1 - cmValues.x2);
      const availableHeightCm = Math.max(0, wallDimensions.height - cmValues.y1 - cmValues.y2);

      if (!isFinite(availableWidthCm) || !isFinite(availableHeightCm)) {
        return;
      }


      if (pixels.y1 > 10) {
        ctx.fillText(
          `${cmValues.y1.toFixed(1)}cm`,
          pixels.x1 + pixels.availableWidth / 2,
          pixels.y1 / 2
        );
      }


      if (pixels.y2 > 10) {
        ctx.fillText(
          `${cmValues.y2.toFixed(1)}cm`,
          pixels.x1 + pixels.availableWidth / 2,
          pixels.y1 + pixels.availableHeight + pixels.y2 / 2
        );
      }


      if (pixels.x1 > 20) {
        ctx.save();
        ctx.translate(pixels.x1 / 2, pixels.y1 + pixels.availableHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${cmValues.x1.toFixed(1)}cm`, 0, 0);
        ctx.restore();
      }


      if (pixels.x2 > 20) {
        ctx.save();
        ctx.translate(
          pixels.x1 + pixels.availableWidth + pixels.x2 / 2,
          pixels.y1 + pixels.availableHeight / 2
        );
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${cmValues.x2.toFixed(1)}cm`, 0, 0);
        ctx.restore();
      }


      if (pixels.availableWidth > 100 && pixels.availableHeight > 30) {
        ctx.fillStyle = '#00aa00';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(
          `Available: ${availableWidthCm.toFixed(1)}×${availableHeightCm.toFixed(1)}cm`,
          pixels.x1 + pixels.availableWidth / 2,
          pixels.y1 + pixels.availableHeight / 2
        );
      }

      ctx.restore();
    } catch (error) {
      console.error('Error drawing dimension labels:', error);
    }
  }, [wallDimensions]);

  const getCanvasCoordinates = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas || !e) return { x: 0, y: 0 };

    try {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      return {
        x: isFinite(x) ? Math.max(0, Math.min(x, canvas.width)) : 0,
        y: isFinite(y) ? Math.max(0, Math.min(y, canvas.height)) : 0
      };
    } catch (error) {
      console.error('Error getting canvas coordinates:', error);
      return { x: 0, y: 0 };
    }
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (!e || !imageLoaded) return;

    const coords = getCanvasCoordinates(e);
    setStartPoint(coords);
    setEndPoint(coords);
    setIsDrawing(true);
  }, [getCanvasCoordinates, imageLoaded]);

  const handleMouseMove = useCallback((e) => {
    if (!e || !imageLoaded) return;

    const coords = getCanvasCoordinates(e);


    if (!isDrawing) {
      const cmX = pixelsToCm(coords.x, 'x');
      const cmY = pixelsToCm(coords.y, 'y');
      if (isFinite(cmX) && isFinite(cmY)) {
        setHoveredArea({ x: cmX.toFixed(1), y: cmY.toFixed(1) });
      }
      return;
    }

    if (!startPoint) return;

    setEndPoint(coords);

    try {

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (!canvas || !ctx) return;

      drawCanvas();


      ctx.save();
      ctx.strokeStyle = '#0066ff';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);

      const width = coords.x - startPoint.x;
      const height = coords.y - startPoint.y;

      if (isFinite(width) && isFinite(height)) {
        ctx.strokeRect(startPoint.x, startPoint.y, width, height);


        const selectionWidthCm = Math.abs(pixelsToCm(width, 'x'));
        const selectionHeightCm = Math.abs(pixelsToCm(height, 'y'));

        if (isFinite(selectionWidthCm) && isFinite(selectionHeightCm) &&
          Math.abs(width) > 20 && Math.abs(height) > 20) {
          ctx.fillStyle = '#0066ff';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            `${selectionWidthCm.toFixed(1)}×${selectionHeightCm.toFixed(1)}cm`,
            startPoint.x + width / 2,
            startPoint.y + height / 2
          );
        }
      }

      ctx.restore();
    } catch (error) {
      console.error('Error in mouse move:', error);
    }
  }, [getCanvasCoordinates, imageLoaded, isDrawing, startPoint, pixelsToCm, drawCanvas]);

  const handleMouseUp = useCallback((e) => {
    if (!isDrawing || !startPoint || !e || !imageLoaded) return;

    try {
      setIsDrawing(false);
      const coords = getCanvasCoordinates(e);


      const x1Px = Math.min(startPoint.x, coords.x);
      const y1Px = Math.min(startPoint.y, coords.y);
      const x2Px = Math.max(startPoint.x, coords.x);
      const y2Px = Math.max(startPoint.y, coords.y);


      const widthCm = pixelsToCm(x2Px - x1Px, 'x');
      const heightCm = pixelsToCm(y2Px - y1Px, 'y');

      if (!isFinite(widthCm) || !isFinite(heightCm) || widthCm < 1 || heightCm < 1) {
        return;
      }


      const canvas = canvasRef.current;
      if (!canvas) return;

      const leftMarginCm = pixelsToCm(x1Px, 'x');
      const topMarginCm = pixelsToCm(y1Px, 'y');
      const rightMarginCm = pixelsToCm(canvas.width - x2Px, 'x');
      const bottomMarginCm = pixelsToCm(canvas.height - y2Px, 'y');


      if (!isFinite(leftMarginCm) || !isFinite(topMarginCm) ||
        !isFinite(rightMarginCm) || !isFinite(bottomMarginCm)) {
        return;
      }


      const validMargins = {
        x1: Math.max(0, Math.round(leftMarginCm * 10) / 10),
        y1: Math.max(0, Math.round(topMarginCm * 10) / 10),
        x2: Math.max(0, Math.round(rightMarginCm * 10) / 10),
        y2: Math.max(0, Math.round(bottomMarginCm * 10) / 10)
      };


      if (wallDimensions?.width && wallDimensions?.height) {
        const totalWidth = validMargins.x1 + validMargins.x2;
        const totalHeight = validMargins.y1 + validMargins.y2;

        if (totalWidth < wallDimensions.width && totalHeight < wallDimensions.height) {
          onAreaSelect?.(validMargins);
        }
      }
    } catch (error) {
      console.error('Error in mouse up:', error);
    } finally {
      setIsDrawing(false);
    }
  }, [isDrawing, startPoint, getCanvasCoordinates, imageLoaded, pixelsToCm, wallDimensions, onAreaSelect]);

  const handleMouseLeave = useCallback(() => {
    setHoveredArea(null);
    if (isDrawing) {
      setIsDrawing(false);
    }
  }, [isDrawing]);

  if (!imageUrl) {
    return (
      <div style={{
        width: '100%',
        height: '300px',
        border: '2px dashed #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <p style={{ color: '#666', fontSize: '16px', marginBottom: '10px' }}>
          Upload an image to select artwork area
        </p>
        <p style={{ color: '#999', fontSize: '14px' }}>
          Set wall dimensions first for accurate CM measurements
        </p>
      </div>
    );
  }

  const ratio = getPixelToCmRatio();
  const availableWidthCm = currentArea ? wallDimensions.width - currentArea.x1 - currentArea.x2 : 0;
  const availableHeightCm = currentArea ? wallDimensions.height - currentArea.y1 - currentArea.y2 : 0;

  return (

    <>
      <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Wall Dimensions:</strong> {wallDimensions.width}cm × {wallDimensions.height}cm
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Scale:</strong> 1cm = {(1 / ratio.x).toFixed(1)} pixels (width) | 1cm = {(1 / ratio.y).toFixed(1)} pixels (height)
        </Typography>
        {currentArea && (
          <Typography variant="body2" color="success.main">
            <strong>Available Artwork Area:</strong> {availableWidthCm.toFixed(1)}cm × {availableHeightCm.toFixed(1)}cm
          </Typography>
        )}
      
      </Box>
      <div style={{
        position: 'relative', aspectRatio: wallDimensions ? `${wallDimensions.width}/${wallDimensions.height}` : '4/3',
        maxHeight: '70vh'
      }}>

        <img
          className='object-contain'
          ref={imageRef}
          src={imageUrl}
          alt="Wall Preview"
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            borderRadius: '15px',
            border: '2px solid #ddd',

          }}
        />
        <canvas
          ref={canvasRef}

          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            cursor: 'crosshair',
            borderRadius: '18px'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />


      </div>
      <Box sx={{ mt: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Instructions:</strong>
        </Typography>
        <Typography variant="body2" component="div">
          • <strong>Red areas:</strong> Margins where artwork cannot be placed<br />
          • <strong>Green area:</strong> Available space for artwork<br />
          • <strong>Grid lines:</strong> 10cm reference grid<br />
          • <strong>Click & drag:</strong> Select new artwork area<br />
          • Values are automatically calculated in centimeters based on wall dimensions
        </Typography>
      </Box>
    </>
  );
};



export function AddVisualize() {
  const id = useSearchParams().get('id') as string;
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const { data, isLoading } = useGetVisualizeById(id);

  const picklist = RenderAllPicklist('Visualize Group');
  const navigate = useNavigate();

  const defaultValues = useMemo(
    () => ({
      name: data?.name || '',
      group: data?.group || '',
      image: data?.image || null,
      dimension_width: data?.dimension_width || 0,
      dimension_height: data?.dimension_height || 0,
      area_x1: data?.area_x1 || 0,
      area_y1: data?.area_y1 || 0,
      area_x2: data?.area_x2 || 0,
      area_y2: data?.area_y2 || 0,
      tags: data?.tags || [],
    }),
    [data]
  );

  const methods = useForm<NewPostSchemaType>({
    resolver: zodResolver(NewPostSchema),
    defaultValues,
  });

  const { reset, setValue, handleSubmit, watch } = methods;

  const watchedImage = watch('image');
  const watchedDimensionWidth = watch('dimension_width');
  const watchedDimensionHeight = watch('dimension_height');
  const watchedAreaX1 = watch('area_x1');
  const watchedAreaY1 = watch('area_y1');
  const watchedAreaX2 = watch('area_x2');
  const watchedAreaY2 = watch('area_y2');



  useEffect(() => {
    if (id && data) {
      const imageUrl = data?.image ? `https://dev.freshartclub.com/images/users/${data?.image}` : null;

      reset({
        name: data?.name || '',
        group: data?.group || '',
        image: imageUrl,
        dimension_width: data?.dimension_width || 0,
        dimension_height: data?.dimension_height || 0,
        area_x1: data?.area_x1 || 0,
        area_y1: data?.area_y1 || 0,
        area_x2: data?.area_x2 || 0,
        area_y2: data?.area_y2 || 0,
        tags: data?.tags || [],
      });

      setImagePreviewUrl(imageUrl);
    }
  }, [data, reset, id]);


  useEffect(() => {
    if (watchedImage) {
      if (typeof watchedImage === 'string') {
        setImagePreviewUrl(watchedImage);
      } else if (watchedImage instanceof File) {
        const url = URL.createObjectURL(watchedImage);
        setImagePreviewUrl(url);

        // Cleanup function
        return () => URL.revokeObjectURL(url);
      }
    } else {
      setImagePreviewUrl(null);
    }
  }, [watchedImage]);

  const { mutate, isPending } = useAddVisualize(id);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!data.image) {
        toast.error('Image is required');
        return;
      }

      // Validate dimensions
      if (!data.dimension_width || !data.dimension_height) {
        toast.error('Wall dimensions (width and height) are required for accurate measurements');
        return;
      }

      // Validate that margins don't exceed wall dimensions
      const availableWidth = data.dimension_width - data.area_x1 - data.area_x2;
      const availableHeight = data.dimension_height - data.area_y1 - data.area_y2;

      if (availableWidth <= 0 || availableHeight <= 0) {
        toast.error('Margin values are too large. Available artwork area must be positive.');
        return;
      }

      const formData = new FormData();

      if (typeof data.image === 'string' && !data.image.includes('https')) {
        formData.append('planImg', data.image);
      } else if (data.image instanceof File) {
        formData.append('planImg', data.image);
      }

      delete data.image;

      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach((item: any) => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, data[key]);
        }
      });

      await mutate(formData);
    } catch (error) {
      console.error(error);
    }
  });

  const handleRemoveImg = () => {
    setValue('image', null);
    setImagePreviewUrl(null);
  };

  const handleAreaSelect = (area) => {
    setValue('area_x1', area.x1);
    setValue('area_y1', area.y1);
    setValue('area_x2', area.x2);
    setValue('area_y2', area.y2);
    toast.success(`Area updated: Margins set to ${area.x1}cm, ${area.y1}cm, ${area.x2}cm, ${area.y2}cm`);
  };


  const availableArea = useMemo(() => {
    if (!watchedDimensionWidth || !watchedDimensionHeight) return null;

    const availableWidth = watchedDimensionWidth - watchedAreaX1 - watchedAreaX2;
    const availableHeight = watchedDimensionHeight - watchedAreaY1 - watchedAreaY2;

    return {
      width: Math.max(0, availableWidth),
      height: Math.max(0, availableHeight),
      area: Math.max(0, availableWidth * availableHeight)
    };
  }, [watchedDimensionWidth, watchedDimensionHeight, watchedAreaX1, watchedAreaY1, watchedAreaX2, watchedAreaY2]);

  const renderDetails = (
    <Card>
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text required name="name" label="Visualize Name" />
        <Field.SingelSelect
          required
          name="group"
          label="Select Group"
          options={picklist ? picklist : []}
        />

        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Wall Dimensions (cm)
        </Typography>
        <Stack direction="row" spacing={2}>
          <Field.Text required name="dimension_width" label="Wall Width (cm)" />
          <Field.Text required name="dimension_height" label="Wall Height (cm)" />
        </Stack>

        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Artwork Area Margins (cm)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Set the margins from each wall edge where artwork cannot be placed
        </Typography>

        <Stack direction="row" spacing={2}>
          <Field.Text required name="area_x1" label="Left Margin (cm)" />
          <Field.Text required name="area_y1" label="Top Margin (cm)" />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Field.Text required name="area_x2" label="Right Margin (cm)" />
          <Field.Text required name="area_y2" label="Bottom Margin (cm)" />
        </Stack>

        {availableArea && (
          <Box sx={{ p: 2, bgcolor: availableArea.width > 0 && availableArea.height > 0 ? 'success.light' : 'error.light', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Available Artwork Area: {availableArea.width.toFixed(1)}cm × {availableArea.height.toFixed(1)}cm
            </Typography>
            <Typography variant="body2">
              Total Area: {availableArea.area.toFixed(1)}cm²
            </Typography>
            {(availableArea.width <= 0 || availableArea.height <= 0) && (
              <Typography variant="body2" color="error">
                ⚠️ Invalid area! Margins are too large for the wall dimensions.
              </Typography>
            )}
          </Box>
        )}

        <Field.Autocomplete
          name="tags"
          label="Tags"
          placeholder="+ Tags"
          multiple
          freeSolo
          disableCloseOnSelect
          options={_tags.map((option) => option)}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="info"
                variant="soft"
              />
            ))
          }
        />
      </Stack>
    </Card>
  );

  const renderImage = (
    <>
      <Card sx={{ mb: 2 }}>
        <CardHeader title="Wall Image *" sx={{ mb: 2 }} />
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Upload name="image" onDelete={handleRemoveImg} />
        </Stack>
      </Card>
    </>
  );

  const renderImageRuler = (
    <Card sx={{ mb: 2 }}>
      <CardHeader title="Visual Artwork Area Selector" sx={{ mb: 2 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        {!watchedDimensionWidth || !watchedDimensionHeight ? (
          <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.light', borderRadius: 1 }}>
            <Typography variant="body1" color="warning.dark">
              ⚠️ Please set wall dimensions first to use the visual selector
            </Typography>
          </Box>
        ) : (
          <ImageRuler
            imageUrl={imagePreviewUrl}
            onAreaSelect={handleAreaSelect}
            currentArea={{
              x1: watchedAreaX1,
              y1: watchedAreaY1,
              x2: watchedAreaX2,
              y2: watchedAreaY2
            }}
            wallDimensions={{
              width: watchedDimensionWidth,
              height: watchedDimensionHeight
            }}
          />
        )}
      </Stack>
    </Card>
  );

  if (isLoading) return <LoadingScreen />;

  return (
    <div>
      <CustomBreadcrumbs
        heading="Add Visualize"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Add Visualize' }]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={5}>
          {renderDetails}
          {renderImage}
          {renderImageRuler}
          <div className="flex flex-row justify-end gap-3 mt-8">
            <span
              onClick={() => navigate(paths.dashboard.visualize.list)}
              className="bg-white text-black border py-2 px-3 rounded-md cursor-pointer hover:bg-gray-50"
            >
              Cancel
            </span>
            <button
              type="submit"
              className="bg-black text-white py-2 px-3 rounded-md hover:bg-gray-800 disabled:opacity-50"
              disabled={isPending}
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </Stack>
      </Form>
    </div>
  );
}